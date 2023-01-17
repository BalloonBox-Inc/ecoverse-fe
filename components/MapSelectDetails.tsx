import LocationGoIcon from '@components/Icons/LocationGoIcon';
import MenuIconClose from '@components/Icons/MenuIconClose';
import { useAuth } from '@context/auth';
import { useMapExtraMethods } from '@context/map';
import useTileWorker, { tileFillInit } from '@hooks/useTileWorker';
import {
  clearSelectedTiles,
  selectAreaTiles,
  selectBatchTiles,
  selectIsSelecting,
  selectSelectedTiles,
  setBatchSelect,
} from '@plugins/store/slices/map';
import { ModalType, setModalType } from '@plugins/store/slices/modal';
import { setTilesToPurchase } from '@plugins/store/slices/purchase';
import { getPlaceFromLngLat } from '@services/map';
import { useQuery } from '@tanstack/react-query';
import { m2ToHaFormat } from '@utils/helper';
import { ClassNameProps } from '@utils/interface/global-interface';
import * as mapUtils from '@utils/map-utils';
import { useRouter } from 'next/router';
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

  const { isAuthenticated } = useAuth();

  const mapMethods = useMapExtraMethods();

  const areaTiles = useSelector(selectAreaTiles);
  const isSelecting = useSelector(selectIsSelecting);
  const selectedTiles = Object.values(useSelector(selectSelectedTiles));
  const batchTiles = Object.values(useSelector(selectBatchTiles));
  const dispatch = useDispatch();
  const router = useRouter();

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
    tileFillWorker.postMessage([batchTiles, selectedTiles]);
  }, [setIsLoading, tileFillWorker, batchTiles, selectedTiles]);

  const handleFillTiles = useCallback(() => {
    if (batchTiles.length === 0) return;
    const toBatchSelect = filledTiles.map((tile) => {
      tile.data = { ...areaTiles[Number(tile.id)].data };
      return tile;
    });
    dispatch(setBatchSelect(toBatchSelect));
  }, [areaTiles, batchTiles, dispatch, filledTiles]);

  const handlePurchase = useCallback(() => {
    dispatch(setTilesToPurchase(selectedTiles));
    if (!isAuthenticated) {
      dispatch(setModalType(ModalType.login));
      return;
    }
    router.push('/checkout');
  }, [dispatch, isAuthenticated, selectedTiles]);

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
              <button
                onClick={handleCenterMap}
                className={styles.buttonContainer}
              >
                <LocationGoIcon className={styles.buttonIcon} />
                <p>Fly to selected area</p>
              </button>
            </div>
            <button onClick={handleClearSelection}>
              <MenuIconClose className={styles.buttonCloseIcon} />
            </button>
          </>
        )}
      </div>

      {!isSelecting && (
        <>
          <div className={styles.detailContainer}>
            <p>
              <>{showLocationName}</>
            </p>
            <p>Total Selected Tiles: {selectedTiles.length}</p>
            <div>
              <p className={styles.bold}>Fill Tile Details</p>
              <p>
                Previous Tiles Area:{' '}
                {m2ToHaFormat(selectedArea - batchFillArea)} ha
              </p>
              <p>Total Fill Calculated Area: {m2ToHaFormat(filledArea)} ha</p>

              {!!filledTiles.length && !!batchTiles.length && (
                <button
                  className={styles.buttonBounding}
                  onClick={handleFillTiles}
                >
                  Fill Tiles
                </button>
              )}

              {!filledTiles.length && (
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

          <button className={styles.checkoutButton} onClick={handlePurchase}>
            Proceed To Checkout
          </button>
        </>
      )}
    </div>
  );
}

const styles = {
  root: 'rounded-lg p-6 max-h-custom-y-screen-2 overflow-y-auto',
  header: 'flex justify-between items-center mb-1',
  bold: 'font-semibold italic',
  buttonContainer:
    'flex items-center text-primary hover:text-secondary text-sm',
  buttonBounding: 'btn btn-primary btn-xs mt-3',
  buttonBoundingLoading: 'loading',
  buttonCloseIcon: 'h-3 w-3 fill-current',
  buttonIcon: 'h-4 w-4 fill-current mr-1',
  locationName: 'flex items-center gap-1',
  areaText: 'font-light text-sm mt-2',
  checkoutButton: 'btn btn-primary w-full mt-10',
  detailContainer: 'flex flex-col gap-4',
};
