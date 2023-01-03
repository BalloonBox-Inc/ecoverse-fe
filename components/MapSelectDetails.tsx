import LocationGoIcon from '@components/Icons/LocationGoIcon';
import MenuIconClose from '@components/Icons/MenuIconClose';
import { useMapExtraMethods } from '@context/map';
import {
  clearSelectedTiles,
  selectBatchTiles,
  selectIsSelecting,
  selectSelectedTiles,
  setBatchSelect,
} from '@plugins/store/slices/map';
import { getPlaceFromLngLat } from '@services/map';
import { useQuery } from '@tanstack/react-query';
import { numFormat } from '@utils/helper';
import { ClassNameProps } from '@utils/interface/global-interface';
import { TileObj } from '@utils/interface/map-interface';
import * as mapUtils from '@utils/map-utils';
import WorkerUtil, { WORKERS } from '@utils/worker-util';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { twMerge } from 'tailwind-merge';

export default function MapSelectDetails({ className }: ClassNameProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const mapMethods = useMapExtraMethods();

  const isSelecting = useSelector(selectIsSelecting);
  const selectedTiles = Object.values(useSelector(selectSelectedTiles));
  const batchTiles = Object.values(useSelector(selectBatchTiles));
  const dispatch = useDispatch();

  const polygon = mapUtils.getPolygonFromTiles(selectedTiles);
  const area = mapUtils.getAreaFromPolygon(polygon);
  const center = mapUtils.getCenterCoordsFromPolygon(polygon);

  const { data: location, isLoading: isLocationLoading } = useQuery({
    queryKey: ['mapLocation', center.lng, center.lat],
    queryFn: () => getPlaceFromLngLat(center.lng, center.lat),
    enabled: !isSelecting,
  });

  const showLocationName = useMemo(() => {
    if (isLocationLoading) return '...';
    return location;
  }, [location, isLocationLoading]);

  const handleCenterMap = useCallback(() => {
    mapMethods?.flyTo(center);
  }, [mapMethods, center]);

  const onTileFillMessageHandler = useCallback(
    (e: MessageEvent<TileObj[]>) => {
      const tiles = e.data;
      dispatch(setBatchSelect(tiles));
      setLoading(false);
    },
    [dispatch, setLoading]
  );

  const tileFillWorker = useMemo(
    () => new WorkerUtil<TileObj[]>(WORKERS.tileFill, onTileFillMessageHandler),
    [onTileFillMessageHandler]
  );

  const handleClearSelection = useCallback(() => {
    dispatch(clearSelectedTiles());
    tileFillWorker.terminate();
  }, [tileFillWorker, dispatch]);

  const handleBoundTiles = useCallback(() => {
    setLoading(true);
    tileFillWorker.postMessage(batchTiles);
  }, [tileFillWorker, batchTiles]);

  return (
    <div className={twMerge(styles.root, className)}>
      <div className={styles.header}>
        {isSelecting ? (
          <p>Selecting...</p>
        ) : (
          <>
            <div className={styles.locationName}>
              <button onClick={handleCenterMap}>
                <LocationGoIcon className={styles.buttonIcon} />
              </button>
              {/* todo: this is just a placeholder */}
              <p>Go to Location</p>
            </div>
            <button onClick={handleClearSelection}>
              <MenuIconClose className={styles.buttonCloseIcon} />
            </button>
          </>
        )}
      </div>

      {!isSelecting && (
        <p>
          <>{showLocationName}</>
        </p>
      )}
      <p>Total Selected Tiles: {selectedTiles.length}</p>
      <p>
        Selected Tiles Area: {numFormat(area)} m<sup>2</sup>
      </p>
      <button
        className={twMerge(
          styles.buttonBounding,
          loading && styles.buttonBoundingLoading
        )}
        onClick={handleBoundTiles}
      >
        Fill Tiles
      </button>
    </div>
  );
}

const styles = {
  root: 'rounded-lg p-4 max-h-custom-y-screen-2 overflow-y-auto',
  header: 'flex justify-between items-center mb-1',
  buttonBounding: 'btn btn-primary btn-xs',
  buttonBoundingLoading: 'loading',
  buttonCloseIcon: 'h-3 w-3 fill-current',
  locationName: 'flex items-center gap-1',
  buttonIcon: 'h-4 w-4 fill-current',
};
