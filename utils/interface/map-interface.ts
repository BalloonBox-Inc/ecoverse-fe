import { getTilesFromBounds } from '@utils/map-utils';

export interface Paint {
  [key: string]: any;
}

export type TileObj = ReturnType<typeof getTilesFromBounds>[0];

export type TilesObj = {
  [id: number]: TileObj;
};

export type TileAreaObj = {
  [id: number]: TilesObj;
};
