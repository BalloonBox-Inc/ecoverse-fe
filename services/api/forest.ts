import axios from '@plugins/axios';
import { m2ToHaFormat } from '@utils/helper';
import { TileObj } from '@utils/interface/map-interface';
import { getAreaFromPolygon, getPolygonUnionFromTiles } from '@utils/map-utils';
import moment from 'moment';

enum URL {
  createForest = '/forests',
  updateTiles = '/tiles/update-nft',
}

const YEAR_OFFSET = 1; // can be added to env variable. in years

export const createForest = async (
  nftId: string,
  nftName: string,
  nftValueSol: number,
  tiles: TileObj[]
) => {
  const polygon = getPolygonUnionFromTiles(tiles);
  const area = getAreaFromPolygon(polygon);

  const start = moment.utc();
  const end = start.clone().add(YEAR_OFFSET, 'years');

  const requestBody = {
    nftId,
    nftName,
    nftArea: Number(m2ToHaFormat(area)),
    nftValueSol,
    geolocation: JSON.stringify(polygon.geometry),
    tileCount: tiles.length,
    carbonUrl: '', // blank for now
    farmId: tiles[0].data.farmId,
    scientificName: [''], // blank for now
    plantStatus: 'Active', //active for now
    mintStatus: false,
    mintStartDate: start.format(),
    mintEndDate: end.format(),
  };

  return await axios({
    method: 'POST',
    url: URL.createForest,
    data: requestBody,
  });
};

export const updateTiles = async (nftId: string, tiles: TileObj[]) => {
  const tilesIds = tiles.map((tile) => `${tile.id}`);
  const requestBody = {
    tiles: tilesIds,
    nftId,
  };
  return await axios({
    method: 'PATCH',
    url: URL.updateTiles,
    data: requestBody,
  });
};
