import LocationGoIcon from '@components/Icons/LocationGoIcon';
import MenuIconClose from '@components/Icons/MenuIconClose';
import { useMapExtraMethods } from '@context/map';
import {
  clearSelectedTiles,
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
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { twMerge } from 'tailwind-merge';

export default function MapSelectDetails({ className }: ClassNameProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const mapMethods = useMapExtraMethods();

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
    mapMethods?.flyTo(center);
  };

  const batchSelect = () => {
    return new Promise((resolve) => {
      // used settimeout to put on timing loop for async functionality
      // ? might have to check other web api for this. settimout looks like a hack
      setTimeout(() => {
        const centers = selectedTiles.map((tile) => {
          const polygon = mapUtils.getPolygonFromTile(tile);
          return mapUtils.getCenterCoordsFromPolygon(polygon);
        });

        resolve(mapUtils.getTilesFromBoundingLngLats(centers));
      });
    });
  };

  const handleBoundTiles = () => {
    setLoading(true);
    batchSelect().then((tiles) => {
      dispatch(setBatchSelect(tiles as TileObj[]));
      setLoading(false);
    });
  };

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
              <p>Fly to selected area</p>
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
      <p>
        Area: {numFormat(area)} m<sup>2</sup>
      </p>
      <button
        className={twMerge(
          styles.buttonBounding,
          loading && styles.buttonBoundingLoading
        )}
        onClick={handleBoundTiles}
      >
        Bound Tiles
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
