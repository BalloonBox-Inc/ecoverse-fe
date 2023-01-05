import LocationGoIcon from '@components/Icons/LocationGoIcon';
import MenuIconClose from '@components/Icons/MenuIconClose';
import { useMapExtraMethods } from '@context/map';
import useTileWorker, { tileFillInit } from '@hooks/useTileWorker';
import {
  clearSelectedTiles,
  selectBatchTiles,
  selectIsSelecting,
  selectSelectedTiles,
  setBatchSelect,
} from '@plugins/store/slices/map';
import { getPlaceFromLngLat } from '@services/map';
import { useQuery } from '@tanstack/react-query';
import { m2ToHaFormat } from '@utils/helper';
import { ClassNameProps } from '@utils/interface/global-interface';
import * as mapUtils from '@utils/map-utils';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { twMerge } from 'tailwind-merge';

export default function MapSelectDetails({ className }: ClassNameProps) {
  const {
    tileFillWorker,
    isLoading,
    setIsLoading,
    filledArea,
    filledTiles,
    setFilledArea,
    setFilledTiles,
  } = useTileWorker();

  const mapMethods = useMapExtraMethods();

  const isSelecting = useSelector(selectIsSelecting);
  const selectedTiles = Object.values(useSelector(selectSelectedTiles));
  const batchTiles = Object.values(useSelector(selectBatchTiles));
  const dispatch = useDispatch();

  const { area: selectedArea, center } = useMemo(() => {
    const polygon = mapUtils.getPolygonFromTiles(selectedTiles);
    const area = mapUtils.getAreaFromPolygon(polygon);
    const center = mapUtils.getCenterCoordsFromPolygon(polygon);

    return { area, center };
  }, [selectedTiles]);

  const batchFillArea = useMemo(() => {
    const polygon = mapUtils.getPolygonFromTiles(batchTiles);
    return mapUtils.getAreaFromPolygon(polygon);
  }, [batchTiles]);

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

  const handleClearSelection = useCallback(() => {
    dispatch(clearSelectedTiles());
    tileFillWorker.terminate();
  }, [tileFillWorker, dispatch]);

  const handleCalculateFillTiles = useCallback(() => {
    setIsLoading(true);
    tileFillWorker.postMessage(batchTiles);
  }, [setIsLoading, tileFillWorker, batchTiles]);

  const handleFillTiles = useCallback(() => {
    dispatch(setBatchSelect(filledTiles));
  }, [dispatch, filledTiles]);

  useEffect(() => {
    if (isSelecting && filledTiles.length > 0) {
      setFilledArea(tileFillInit.area);
      setFilledTiles(tileFillInit.tiles);
    }
  }, [filledTiles, isSelecting, setFilledArea, setFilledTiles]);

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

      <p>Total Selected Tiles: {selectedTiles.length}</p>
      {!isSelecting && (
        <div className="flex flex-col gap-4">
          <p>
            <>{showLocationName}</>
          </p>

          <div>
            <p>Fill Tile Details</p>
            <p>
              Previous Tiles Area: {m2ToHaFormat(selectedArea - batchFillArea)}{' '}
              ha
            </p>
            <p>Fill Calculated Area: {m2ToHaFormat(filledArea)} ha</p>

            {filledTiles.length ? (
              <button
                className={styles.buttonBounding}
                onClick={handleFillTiles}
              >
                Fill Tiles
              </button>
            ) : (
              <button
                className={twMerge(
                  styles.buttonBounding,
                  isLoading && styles.buttonBoundingLoading
                )}
                onClick={handleCalculateFillTiles}
              >
                Calculate Fill Area
              </button>
            )}
          </div>
        </div>
      )}
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
