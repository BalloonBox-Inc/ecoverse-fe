import { union } from '@turf/turf';
import { TileObj } from '@utils/interface/map-interface';
import * as mapUtils from '@utils/map-utils';


onmessage = (e: MessageEvent<[TileObj[], TileObj[]]>) => {
  const [batchTiles, selectedTiles] = e.data;
  
  
  if (batchTiles.length === 0) {
    postMessage({tiles: [], area: 0})
    return;
  }
  
  const centers = batchTiles.map((tile) => {
    const polygon = mapUtils.getPolygonFromTile(tile);
    return mapUtils.getCenterCoordsFromPolygon(polygon);
  });
  const tiles = mapUtils.getTilesFromBoundingLngLats(centers);

  const polygon = mapUtils.getPolygonUnionFromTiles(tiles);
  const polygonSelected = mapUtils.getPolygonUnionFromTiles(selectedTiles);
  const totalPolygon = union(polygon, polygonSelected)
  const area = totalPolygon ? mapUtils.getAreaFromPolygon(totalPolygon) : 0;
  postMessage({tiles, area});
};

export {};
