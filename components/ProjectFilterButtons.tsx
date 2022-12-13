import MenuIconClose from '@components/Icons/MenuIconClose';
import { useFilters } from '@hooks/useFilters';
import { Filter, unsetFilter } from '@plugins/store/slices/filter';
import { clearSearch } from '@plugins/store/slices/search-query';
import { useDispatch } from 'react-redux';

export default function ProjectFilterButtons() {
  const dispatch = useDispatch();
  const filters = useFilters();

  const onClickHandler = (filter: Filter) => {
    return () => {
      dispatch(filter === 'search' ? clearSearch() : unsetFilter(filter));
    };
  };

  return (
    <div className={styles.root}>
      {Object.entries(filters).map((filter) => (
        <button
          key={filter[0]}
          className={styles.button}
          onClick={onClickHandler(filter[0] as Filter)}
        >
          <MenuIconClose className={styles.closeIcon} />
          {filter[0]}: {filter[1]?.toString()}
        </button>
      ))}
    </div>
  );
}

const styles = {
  root: 'flex gap-2 items-center',
  counter: 'text-xs',
  button: 'btn btn-outline btn-ghost btn-xs gap-1 items-center capitalize',
  closeIcon: 'h-2 w-2 fill-current',
};
