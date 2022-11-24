import Search from '@components/layouts/Search';
import MapSearchQuery from '@components/MapSearchQuery';
import { queryEventBus } from '@services/event-bus/query';
import { useEffect, useState } from 'react';

export default function MapSearch() {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    queryEventBus.on('clearQuery', clearQuery);

    return () => {
      queryEventBus.off('clearQuery', clearQuery);
    };
  }, []);

  const handleQuery = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(target.value);
  };

  const handleClear: React.MouseEventHandler<HTMLButtonElement> = () => {
    clearQuery();
  };

  const clearQuery = () => {
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
