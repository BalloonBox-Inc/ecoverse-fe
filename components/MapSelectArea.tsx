import LocationGoIcon from '@components/Icons/LocationGoIcon';
import MenuIconClose from '@components/Icons/MenuIconClose';
import { useMapExtraMethods } from '@context/map';
import {
  clearSelectedArea,
  selectSelectedArea,
} from '@plugins/store/slices/map';
import { getForestById, QueriedForest } from '@services/api/forest';
import { QueriedProject } from '@services/api/projects';
import { ClassNameProps } from '@utils/interface/global-interface';
import * as mapUtils from '@utils/map-utils';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { twMerge } from 'tailwind-merge';

export default function MapSelectArea({ className }: ClassNameProps) {
  const dispatch = useDispatch();
  const [forest, setForest] = useState<Omit<QueriedForest, 'tiles'> | null>(
    null
  );

  const mapMethods = useMapExtraMethods();
  //   todo: need to work on the wallet integration to check if the forest is own by wallet owner

  const selectedArea = useSelector(selectSelectedArea);

  const project: QueriedProject = useMemo(() => {
    const tiles = Object.values(selectedArea);
    return tiles[0].data;
  }, [selectedArea]);

  const handleFlyToLocation = () => {
    if (!forest) return;
    const center = mapUtils.getCenterCoordsFromPolygon(
      JSON.parse(forest.geolocation)
    );
    mapMethods?.flyTo(center);
  };

  const handleClearSelection = () => {
    dispatch(clearSelectedArea());
  };

  useEffect(() => {
    const tiles = Object.values(selectedArea);
    const nftId = tiles[0].data.area;

    getForestById(nftId).then((response) => setForest(response));
  }, [selectedArea]);

  return (
    <div className={twMerge(styles.root, className)}>
      <div className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <button onClick={handleFlyToLocation}>
            <LocationGoIcon className={styles.buttonIcon} />
          </button>
          <h2 className={styles.header}>{forest?.nftName}</h2>
        </div>
        <button onClick={handleClearSelection}>
          <MenuIconClose className={styles.buttonCloseIcon} />
        </button>
      </div>
      <div>
        <p>{project.groupScheme}</p>
        <p>Product Group: {project.productGroup}</p>
      </div>
      <div>
        <p>Tiles: {forest?.tileCount}</p>
        <p>Area: {forest?.nftArea} ha</p>
        <p>Status: {forest?.plantStatus}</p>
      </div>
    </div>
  );
}

const styles = {
  root: 'rounded-lg p-6 max-h-custom-y-screen-2 overflow-y-auto flex flex-col gap-4',
  headerContainer: 'flex items-center justify-between',
  headerContent: 'flex items-center gap-1',
  header: 'uppercase',
  buttonIcon: 'h-4 w-4 fill-current mr-1',
  buttonCloseIcon: 'h-3 w-3 fill-current',
};
