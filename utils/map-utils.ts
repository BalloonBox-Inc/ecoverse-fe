import { Center } from '@services/map';
import booleanIntersects from '@turf/boolean-intersects';
import * as turf from '@turf/helpers';
import {
  area,
  bbox,
  booleanContains,
  center,
  centerOfMass,
  circle,
  Feature,
  flatten,
  lineIntersect,
  lineString,
  lineToPolygon,
  MultiPolygon,
  points,
  Properties,
  union,
} from '@turf/turf';
import { TileObj } from '@utils/interface/map-interface';
import Mapbox, { LngLat, LngLatBounds, Point } from 'mapbox-gl';

type XY = Pick<Point, 'x' | 'y'>;

type Bounds = {
  se: XY;
  nw: XY;
};

export type IPolygon = turf.Feature<
  turf.Polygon | turf.MultiPolygon,
  Properties
>;

export type ILineString = turf.Feature<turf.LineString, turf.Properties>;

type CircleOptions = {
  steps?: number | undefined;
  units?: turf.Units | undefined;
  properties?: turf.Properties | undefined;
};

// export const STEP = 0.00012789768185452;
export const STEP = 0.00009789033926677475;

export const step_x = STEP;
export const step_y = STEP;

export function getMercatorCoordinateFromLngLat(cord: LngLat) {
  const wrappedCord = cord.wrap();

  let x = ((wrappedCord.lng + 180) / 360) * 256;
  let y =
    ((1 -
      Math.log(
        Math.tan((wrappedCord.lat * Math.PI) / 180) +
          1 / Math.cos((wrappedCord.lat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
    Math.pow(2, 0) *
    256;
  return { x, y };
}

export function getMercatorCoordinateBoundsFromMercatorCoordinate(
  mercatorCord: XY
) {
  const n = mercatorCord.y - (mercatorCord.y % step_y);
  const s = n + step_y;
  const w = mercatorCord.x - (mercatorCord.x % step_x);
  const e = w + step_x;

  return { nw: { x: w, y: n }, se: { x: e, y: s } };
}

export function getLngLatFromMercatorCoordinate(
  mercatorCord: XY,
  precision = 6
) {
  const lng = Number.parseFloat(
    ((mercatorCord.x / 256) * 360 - 180).toFixed(precision)
  );
  const n = Math.PI - (2 * Math.PI * mercatorCord.y) / 256;
  const lat = Number.parseFloat(
    ((180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))).toFixed(
      precision
    )
  );
  return getCenterFromLngLat(lng, lat);
}

export function getPositionFromMercatorCoordinate(mercatorCord: XY) {
  const x = Math.round(mercatorCord.x / step_x);
  const y = Math.round(mercatorCord.y / step_y);
  return { x, y };
}

export function getIdFromMercatorCoordinate(mercatorCord: XY) {
  const position = getPositionFromMercatorCoordinate(mercatorCord);
  return getIdFromPosition(position);
}

export function getIdFromPosition(position: XY) {
  return position.x * Math.round(256 / step_y) + (position.y + 1);
}

export function getBoundsFromMercatorCoordinateBounds(
  mercatorBounds: Bounds,
  adjust = 0
) {
  // sw, ne
  const xy = mercatorBounds.nw;
  const ne = getLngLatFromMercatorCoordinate({
    x: xy.x + step_x + step_x * adjust,
    y: xy.y - step_y * adjust,
  });
  const sw = getLngLatFromMercatorCoordinate({
    x: xy.x - step_x * adjust,
    y: xy.y + step_y + step_y * adjust,
  });
  return new Mapbox.LngLatBounds(ne, sw);
}

export function getGridDataFromBounds(bounds: LngLatBounds) {
  const nw = getMercatorCoordinateFromLngLat(bounds.getNorthWest());
  const se = getMercatorCoordinateFromLngLat(bounds.getSouthEast());

  const nwTile = getMercatorCoordinateBoundsFromMercatorCoordinate(nw);
  const seTile = getMercatorCoordinateBoundsFromMercatorCoordinate(se);

  let features = [];

  for (let x = nwTile.nw.x; x <= seTile.se.x; x += step_x) {
    let startPoint = { x: x, y: nwTile.nw.y };
    let endPoint = { x: x, y: seTile.se.y };

    let sP = getLngLatFromMercatorCoordinate(startPoint);
    let eP = getLngLatFromMercatorCoordinate(endPoint);
    let vertical = turf.lineString(
      [
        [sP.lng, sP.lat],
        [eP.lng, eP.lat],
      ],
      { name: 'V' }
    );
    features.push(vertical);
  }

  for (let y = nwTile.nw.y; y <= seTile.se.y; y += step_y) {
    let startPoint = { x: nwTile.nw.x, y: y };
    let endPoint = { x: seTile.se.x, y: y };

    let sP = getLngLatFromMercatorCoordinate(startPoint);
    let eP = getLngLatFromMercatorCoordinate(endPoint);
    let horizontal = turf.lineString(
      [
        [sP.lng, sP.lat],
        [eP.lng, eP.lat],
      ],
      { name: 'H' }
    );
    features.push(horizontal);
  }

  return turf.featureCollection(features);
}

export function getTilesFromBounds(bounds: LngLatBounds) {
  const nw = getMercatorCoordinateFromLngLat(bounds.getNorthWest());
  const se = getMercatorCoordinateFromLngLat(bounds.getSouthEast());

  const nwTile = getMercatorCoordinateBoundsFromMercatorCoordinate(nw);
  const seTile = getMercatorCoordinateBoundsFromMercatorCoordinate(se);

  return getTilesBetweenMercatorBounds(nwTile, seTile);
}

export function getTilesBetweenMercatorBounds(nwTile: Bounds, seTile: Bounds) {
  const tiles = [];

  for (let x = nwTile.nw.x; x < seTile.se.x; x += step_x) {
    for (let y = nwTile.nw.y; y < seTile.se.y; y += step_y) {
      const tile = {
        bounds: {
          nw: { x: x, y: y },
          se: { x: x + step_x, y: y + step_y },
        },
        id: getIdFromMercatorCoordinate({ x, y }),
        data: undefined,
      };
      tiles.push(tile);
    }
  }

  return tiles;
}

export function getNwSeFromBounds(a: Bounds, b: Bounds) {
  // a - actual
  // b - first selected

  if (a.nw.x >= b.nw.x && a.nw.y >= b.nw.y) {
    // bottom - right
    return [b, a];
  } else if (a.nw.x <= b.nw.x && a.nw.y <= b.nw.y) {
    // top - left
    return [a, b];
  } else if (a.nw.x >= b.nw.x && a.nw.y <= b.nw.y) {
    // top right
    return [
      { nw: { x: b.nw.x, y: a.nw.y }, se: { x: b.se.x, y: a.se.y } },
      { nw: { x: a.nw.x, y: b.nw.y }, se: { x: a.se.x, y: b.se.y } },
    ];
  } else if (a.nw.x <= b.nw.x && a.nw.y >= b.nw.y) {
    // bottom - left
    return [
      { nw: { x: a.nw.x, y: b.nw.y }, se: { x: a.se.x, y: b.se.y } },
      { nw: { x: b.nw.x, y: a.nw.y }, se: { x: b.se.x, y: a.se.y } },
    ];
  }

  return [a, b];
}

export function getMercatorCoordinateFromTileId(id: number) {
  const coordY = Math.round(256 / step_y);
  const idModX = id % coordY;

  return {
    x: (idModX === 0 ? id / coordY - 1 : (id - idModX) / coordY) * step_x,
    y: (idModX === 0 ? coordY - 1 : idModX - 1) * step_y,
  };
}

export function getMercatorBoundsFromTileId(id: number) {
  const tileCoord = getMercatorCoordinateFromTileId(id);
  return {
    nw: tileCoord,
    se: {
      x: tileCoord.x + step_x,
      y: tileCoord.y + step_y,
    },
  };
}

export function getPolygonFromTile(
  tile: TileObj
): turf.Feature<turf.Polygon | turf.MultiPolygon, turf.Properties> {
  const bounds = getBoundsFromMercatorCoordinateBounds(tile.bounds);

  return turf.polygon(
    [
      [
        bounds.getNorthWest().toArray(),
        bounds.getSouthWest().toArray(),
        bounds.getSouthEast().toArray(),
        bounds.getNorthEast().toArray(),
        bounds.getNorthWest().toArray(),
      ],
    ],
    {
      type: 'tile',
      data: tile.data,
    }
  );
}

export function getPolygonFromTiles(tiles: TileObj[]) {
  return turf.featureCollection(tiles.map((tile) => getPolygonFromTile(tile)));
}

export function getAreaFromPolygon(
  polygon: turf.FeatureCollection | turf.Feature
) {
  return area(polygon);
}

// export function getFeatureFromGeoJson(
//   geoJson: GeoJSON.Feature<GeoJSON.Geometry>
// ): IPolygon {
//   return turf.feature(geoJson);
// }

export function getCollectionFromPolygons(polygons: IPolygon[]) {
  return turf.featureCollection(polygons);
}

// export function isMultipolygon(tiles) {
//   const polygonUnion = getPolygonUnionFromTiles(tiles);
//   return polygonUnion?.geometry?.type === 'MultiPolygon';
// }

export function getPolygonUnionFromTiles(
  tiles: TileObj[]
): ReturnType<typeof getPolygonFromTile> {
  if (tiles?.length === 0)
    return {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [] },
      properties: {},
    };

  let polygonUnion: ReturnType<typeof getPolygonFromTile> | null = null;

  tiles.forEach((tile) => {
    const tilePolygon = getPolygonFromTile(tile);

    if (!polygonUnion) {
      polygonUnion = tilePolygon;
    } else {
      polygonUnion = union(tilePolygon, polygonUnion);
    }
  });

  if (!polygonUnion)
    return {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [] },
      properties: {},
    };

  return polygonUnion;
}

export function getCenterCoordsFromPolygon(
  polygon: turf.FeatureCollection | turf.Feature
) {
  const coords = center(polygon)?.geometry?.coordinates;
  return getCenterFromLngLat(coords[0], coords[1]);
}

export function getCenterFromLngLat(lng: number, lat: number): Center {
  return new Mapbox.LngLat(lng, lat);
}

export function getPolygonFromBoundingLngLats(lngLatArray: LngLat[]) {
  let points: LngLat[] = [];

  if (lngLatArray.length === 0) {
    throw new Error('List should have at least 3 points');
  }

  if (lngLatArray.length === 1) {
    points = Array(4)
      .fill(null)
      .map(() => lngLatArray[0]);
  }

  if (lngLatArray.length === 2) {
    points = lngLatArray.concat(lngLatArray.reverse());
  }

  if (lngLatArray.length > 2) {
    points = lngLatArray.concat(lngLatArray[0]);
  }

  // const sortedPoints = sortLngLatCCW(points);
  const line = lineString(points.map((lngLat) => lngLat.toArray()));

  return lineToPolygon(line);
}

// * probably don't need this sorting
export function sortLngLatCCW(lngLatArray: LngLat[]) {
  const pointsArray = lngLatArray.map((lngLat) => lngLat.toArray());
  const feature = points(pointsArray);
  const centerPoint = centerOfMass(feature).geometry.coordinates;

  return lngLatArray.sort((lngLatA, lngLatB) => {
    const pointA = lngLatA.toArray();
    const pointB = lngLatB.toArray();

    const angleA = Math.atan2(
      pointA[1] - centerPoint[1],
      pointA[0] - centerPoint[0]
    );
    const angleB = Math.atan2(
      pointB[1] - centerPoint[1],
      pointB[0] - centerPoint[0]
    );

    return angleA - angleB;
  });
}

export function getBoundsFromPolygon(polygon: IPolygon) {
  const [minX, minY, maxX, maxY] = bbox(polygon);
  const sw = getCenterFromLngLat(minX, minY);
  const ne = getCenterFromLngLat(maxX, maxY);

  return new Mapbox.LngLatBounds(sw, ne);
}

export function getTilesFromBoundingLngLats(lngLatArray: LngLat[]) {
  const polygon = getPolygonFromBoundingLngLats(lngLatArray);

  return getTilesFromPolygon(polygon);
}

export function getTilesFromPolygon(
  polygon: IPolygon,
  intersects: boolean = true
) {
  const bounds = getBoundsFromPolygon(polygon);

  const tiles = getTilesFromBounds(bounds);

  const selectedTiles = tiles.filter((tile) => {
    const tilePolygon = getPolygonFromTile(tile);
    return intersects
      ? booleanIntersects(
          polygon as Feature<MultiPolygon, Properties>,
          tilePolygon
        )
      : booleanContains(
          polygon as Feature<MultiPolygon, Properties>,
          tilePolygon
        );
  });

  return selectedTiles;
}

// todo: might not need this circle
export function getCircle(
  radius: number,
  center: number[],
  options: CircleOptions = {
    steps: 256,
    units: 'meters',
    properties: {},
  }
) {
  return circle(center, radius, options);
}

export function getGridDataFromPolygon(polygon: IPolygon) {
  const poly = flatten(polygon);
  const bounds = getBoundsFromPolygon(polygon);
  const gridData = getGridDataFromBounds(bounds);

  const features: Feature<turf.LineString, Properties>[] = [];

  gridData.features.forEach((feature) => {
    const points = lineIntersect(feature, poly);
    if (points.features.length > 1) {
      const segment = lineString(
        points.features.map((feature) => feature.geometry.coordinates)
      );
      features.push(segment);
    }
  });

  return turf.featureCollection(features);
}
