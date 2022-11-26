import * as turf from '@turf/helpers';
// import { center, union } from '@turf/turf';
import { TileObj } from '@utils/interface/map-interface';
import Mapbox, { LngLat, LngLatBounds, Point } from 'mapbox-gl';

type XY = Pick<Point, 'x' | 'y'>;

interface Bounds {
  se: XY;
  nw: XY;
}

export const step_x = 0.0012789768185452;
export const step_y = 0.0012789768185452;

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
  return new Mapbox.LngLat(lng, lat);
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

export function getPolygonFromTile(tile: TileObj) {
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
    tile.data
  );
}

// export function getPolygonFromTiles(tiles) {
//   return turf.featureCollection(tiles.map((tile) => getPolygonFromTile(tile)));
// }

// export function getFeatureFromGeoJson(geoJson) {
//   return turf.feature(geoJson);
// }

// export function getCollectionFromPolygons(polygons) {
//   return turf.featureCollection(polygons);
// }

// export function isMultipolygon(tiles) {
//   const polygonUnion = getPolygonUnionFromTiles(tiles);
//   return polygonUnion?.geometry?.type === 'MultiPolygon';
// }

// export function getPolygonUnionFromTiles(tiles) {
//   let polygonUnion;

//   tiles.forEach((tile) => {
//     const tilePolygon = getPolygonFromTile(tile);

//     if (!polygonUnion) {
//       polygonUnion = tilePolygon;
//     } else {
//       polygonUnion = union(polygonUnion.geometry, tilePolygon.geometry);
//     }
//   });
//   return polygonUnion;
// }

// export function getCenterCoordsFromPolygon(polygon) {
//   const coords = center(polygon)?.geometry?.coordinates;
//   return new Mapbox.LngLat(coords[0], coords[1]);
// }
