export interface Paint {
  [key: string]: any;
}

export type TileObj = {
  bounds: {
    nw: {
      x: number;
      y: number;
    };
    se: {
      x: number;
      y: number;
    };
  };
  id: number;
  data: any | undefined;
};

export type TilesObj = {
  [id: number]: TileObj;
};

export type TileAreaObj = {
  [id: string]: TilesObj;
};
