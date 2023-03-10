import axios from '@plugins/axios';
import { m2ToHaFormat } from '@utils/helper';
import { TileObj } from '@utils/interface/map-interface';
import { getAreaFromPolygon, getPolygonUnionFromTiles } from '@utils/map-utils';
import moment from 'moment';
import { LngLatBounds } from 'react-map-gl';

enum URL {
  forest = '/forests',
  updateTiles = '/tiles/update-nft',
  forestByBounds = '/forests/bounds',
}

const YEAR_OFFSET = 1; // can be added to env variable. in years

export interface QueriedForest {
  nftId: string;
  nftName: string;
  nftArea: number;
  nftValueSol: number;
  tileCount: number;
  carbonUrl: string;
  mintStatus: boolean;
  mintStartDate: string;
  mintEndDate: string;
  farmId: string;
  plantStatus: string;
  scientificName: string[];
  geolocation: string;
  tiles: string[];
}

export const createForest = async (
  nftId: string,
  nftValueSol: number,
  tiles: TileObj[]
) => {
  const polygon = getPolygonUnionFromTiles(tiles);
  const area = getAreaFromPolygon(polygon);

  const start = moment.utc();
  const end = start.clone().add(YEAR_OFFSET, 'years');

  const requestBody = {
    nftId,
    nftName: '',
    nftArea: Number(m2ToHaFormat(area)),
    nftValueSol,
    geolocation: JSON.stringify(polygon.geometry),
    tileCount: tiles.length,
    carbonUrl: '', // blank for now
    farmId: tiles[0].data.farmId,
    scientificName: [''], // blank for now
    plantStatus: 'Active', //active for now
    mintStartDate: start.format(),
    mintEndDate: end.format(),
  };

  return await axios({
    method: 'POST',
    url: URL.forest,
    data: requestBody,
  });
};

export const updateForestTiles = async (nftId: string, tiles: TileObj[]) => {
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

export const getForestByBounds = async (
  bounds: LngLatBounds | null
): Promise<QueriedForest[]> => {
  if (!bounds) return [];

  const boundsList = [
    ['n', bounds.getNorth()],
    ['s', bounds.getSouth()],
    ['e', bounds.getEast()],
    ['w', bounds.getWest()],
  ];

  const boundsQuery = boundsList
    .map((direction) => direction.join('='))
    .join('&');

  return (
    await axios({
      method: 'GET',
      url: `${URL.forestByBounds}?${boundsQuery}`,
    })
  ).data;
};

export const getForestById = async (nftId: string) => {
  return (await axios({ method: 'GET', url: `${URL.forest}/${nftId}` })).data;
};
