import { TileObj } from '@utils/interface/map-interface';
import * as mapUtils from '@utils/map-utils';


onmessage = (e: MessageEvent<TileObj[]>) => {
  const selectedTiles = e.data;
  
  if (selectedTiles.length === 0) {
    postMessage([])
    return;
  }
  
  const centers = selectedTiles.map((tile) => {
    const polygon = mapUtils.getPolygonFromTile(tile);
    return mapUtils.getCenterCoordsFromPolygon(polygon);
  });
  const tiles = mapUtils.getTilesFromBoundingLngLats(centers);
  postMessage(tiles);
};

export {};
