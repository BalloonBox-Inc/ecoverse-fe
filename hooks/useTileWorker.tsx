import { TileObj } from '@utils/interface/map-interface';
import WorkerUtil, { WORKERS } from '@utils/worker-util';
import { useCallback, useMemo, useState } from 'react';

type MessageHandler = {
  tiles: TileObj[];
  area: number;
};

export const tileFillInit = {
  tiles: [],
  area: 0,
};

export default function useTileWorker() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filledArea, setFilledArea] = useState<number>(tileFillInit.area);
  const [filledTiles, setFilledTiles] = useState<TileObj[]>(tileFillInit.tiles);

  const onTileFilleMessageHandler = useCallback(
    (e: MessageEvent<MessageHandler>) => {
      const { tiles, area } = e.data;
      setFilledArea(area);
      setFilledTiles(tiles);
      setIsLoading(false);
    },
    [setIsLoading]
  );

  const tileFillWorker = useMemo(
    () =>
      new WorkerUtil<MessageHandler>(
        WORKERS.tileFill,
        onTileFilleMessageHandler
      ),
    [onTileFilleMessageHandler]
  );

  return {
    tileFillWorker,
    isLoading,
    setIsLoading,
    filledArea,
    filledTiles,
    setFilledArea,
    setFilledTiles,
  };
}
