import { setBatchSelect } from '@plugins/store/slices/map';
import { TileObj } from '@utils/interface/map-interface';
import WorkerUtil, { WORKERS } from '@utils/worker-util';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function useTileWorker() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const onTileFilleMessageHandler = useCallback(
    (e: MessageEvent<TileObj[]>) => {
      const tiles = e.data;
      dispatch(setBatchSelect(tiles));
      setIsLoading(false);
    },
    [dispatch, setIsLoading]
  );

  const tileFillWorker = useMemo(
    () =>
      new WorkerUtil<TileObj[]>(WORKERS.tileFill, onTileFilleMessageHandler),
    [onTileFilleMessageHandler]
  );

  return {
    tileFillWorker,
    isLoading,
    setIsLoading,
  };
}
