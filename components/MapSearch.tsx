import Search from '@components/layouts/Search';
import MapSearchQuery from '@components/MapSearchQuery';
import { useState } from 'react';

export default function MapSearch() {
  const [query, setQuery] = useState<string>('');

  const handleQuery = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(target.value);
  };

  const handleClear: React.MouseEventHandler<HTMLButtonElement> = () => {
    setQuery('');
  };

  return (
    <>
      <Search query={query} queryCallback={handleQuery} />

      {!!query && (
        <MapSearchQuery query={query} clearQueryCallback={handleClear} />
      )}
    </>
  );
}
