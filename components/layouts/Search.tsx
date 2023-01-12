import SearchIcon from '@components/Icons/SearchIcon';
import { selectQuery, setSearch } from '@plugins/store/slices/search-query';
import { ClassNameProps } from '@utils/interface/global-interface';
import { useDispatch, useSelector } from 'react-redux';
import { twMerge } from 'tailwind-merge';

interface Props extends ClassNameProps {
  placeholder: string;
}

Search.defaultProps = {
  placeholder: 'Search',
};

export default function Search({ className, placeholder }: Props) {
  const query = useSelector(selectQuery);
  const dispatch = useDispatch();
  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(target.value));
  };

  return (
    <div className={twMerge(styles.root, className)}>
      <input
        type="text"
        placeholder={placeholder}
        className={styles.input}
        onChange={handleChange}
        value={query}
      />
    </div>
  );
}

const styles = {
  root: 'form-control',
  input: 'rounded px-4 py-2',
};
