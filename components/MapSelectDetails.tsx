import LocationGoIcon from '@components/Icons/LocationGoIcon';
import MenuIconClose from '@components/Icons/MenuIconClose';
import {
  clearSelectedTiles,
  selectIsSelecting,
  selectSelectedTiles,
} from '@plugins/store/slices/map';
import { mapEventBus } from '@services/event-bus/map';
import { getPlaceFromLngLat } from '@services/map';
import { useQuery } from '@tanstack/react-query';
import { ClassNameProps } from '@utils/interface/global-interface';
import * as mapUtils from '@utils/map-utils';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { twMerge } from 'tailwind-merge';

export default function MapSelectDetails({ className }: ClassNameProps) {
  const isSelecting = useSelector(selectIsSelecting);
  const selectedTiles = Object.values(useSelector(selectSelectedTiles));
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

  const handleClearSelection = () => {
    dispatch(clearSelectedTiles());
  };

  const handleCenterMap = () => {
    mapEventBus.emit('onCenter', center);
  };

  return (
    <div className={twMerge(styles.root, className)}>
      <div className={styles.header}>
        {isSelecting ? (
          <h1>Selecting...</h1>
        ) : (
          <>
            <div className={styles.locationName}>
              <button onClick={handleCenterMap}>
                <LocationGoIcon className={styles.buttonIcon} />
              </button>
              {/* todo: this is just a placeholder */}
              <h1>Fly to selected area</h1>
            </div>
            <button onClick={handleClearSelection}>
              <MenuIconClose className={styles.buttonCloseIcon} />
            </button>
          </>
        )}
      </div>

      {!isSelecting && (
        <>
          <p>
            <>{showLocationName}</>
          </p>
        </>
      )}
      <p>
        Area: {area.toFixed(2)} m<sup>2</sup>
      </p>
    </div>
  );
}

const styles = {
  root: 'rounded-lg p-4 max-h-custom-y-screen-2 overflow-y-auto',
  header: 'flex justify-between items-center',
  buttonCloseIcon: 'h-3 w-3 fill-current',
  locationName: 'flex items-center gap-2',
  buttonIcon: 'h-5 w-5 fill-current',
};
