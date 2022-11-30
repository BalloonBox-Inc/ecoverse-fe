import { selectQuery, setSearch } from '@plugins/store/slices/search-query';
import { ClassNameProps } from '@utils/interface/global-interface';
import { useDispatch, useSelector } from 'react-redux';
import { twMerge } from 'tailwind-merge';

export default function Search({ className }: ClassNameProps) {
  const query = useSelector(selectQuery);
  const dispatch = useDispatch();
  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(target.value));
  };

  return (
    <div className={twMerge(styles.root, className)}>
      <input
        type="text"
        placeholder="Search"
        className={styles.input}
        onChange={handleChange}
        value={query}
      />
    </div>
  );
}

const styles = {
  root: 'form-control',
  input: 'input input-bordered input-accent',
};
