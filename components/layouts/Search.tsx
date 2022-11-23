import { ClassNameProps } from '@utils/interface/global-interface';
import { twMerge } from 'tailwind-merge';

interface Props extends ClassNameProps {
  query: string;
  queryCallback: React.ChangeEventHandler<HTMLInputElement>;
}

Search.defaultProps = {
  query: '',
  queryCallback: () => {},
};

export default function Search({ className, query, queryCallback }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    queryCallback(e);
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
