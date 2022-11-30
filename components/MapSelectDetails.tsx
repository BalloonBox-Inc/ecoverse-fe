import {
  selectIsSelecting,
  selectSelectedTiles,
} from '@plugins/store/slices/map';
import { ClassNameProps } from '@utils/interface/global-interface';
import { useSelector } from 'react-redux';
import { twMerge } from 'tailwind-merge';

export default function MapSelectDetails({ className }: ClassNameProps) {
  const isSelecting = useSelector(selectIsSelecting);
  const selectedTiles = Object.values(useSelector(selectSelectedTiles));

  return (
    <div className={twMerge(styles.root, className)}>
      {isSelecting ? <h1>Selecting...</h1> : <h1>Selected</h1>}
      {!isSelecting && <h1>{selectedTiles.length}</h1>}
    </div>
  );
}

const styles = {
  root: 'mt-4 bg-secondary/80 backdrop-blur shadow-lg rounded-lg p-4 max-h-custom-y-screen-2 overflow-y-auto',
};
