import {
  clearSelectedTiles,
  selectIsSelecting,
  selectSelectedTiles,
} from '@plugins/store/slices/map';
import { mapEventBus } from '@services/event-bus/map';
import { ClassNameProps } from '@utils/interface/global-interface';
import * as mapUtils from '@utils/map-utils';
import { useDispatch, useSelector } from 'react-redux';
import { twMerge } from 'tailwind-merge';

export default function MapSelectDetails({ className }: ClassNameProps) {
  const isSelecting = useSelector(selectIsSelecting);
  const selectedTiles = Object.values(useSelector(selectSelectedTiles));
  const dispatch = useDispatch();

  const polygon = mapUtils.getPolygonFromTiles(selectedTiles);
  const area = mapUtils.getAreaFromPolygon(polygon);
  const center = mapUtils.getCenterCoordsFromPolygon(polygon);

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
            <h1>Selected</h1>
            <button onClick={handleClearSelection}>Clear</button>
          </>
        )}
      </div>

      <button onClick={handleCenterMap}>Go to Selected Tiles</button>

      <p>
        Area: {area.toFixed(2)} m<sup>2</sup>
      </p>
      <p>{center.toString()}</p>
    </div>
  );
}

const styles = {
  root: 'bg-secondary/80 backdrop-blur shadow-lg rounded-lg p-4 max-h-custom-y-screen-2 overflow-y-auto',
  header: 'flex justify-between items-center',
};
