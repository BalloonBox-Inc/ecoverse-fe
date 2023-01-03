import MapSearchQueryItem from '@components/MapSearchQueryItem';
import { clearSearch, selectQuery } from '@plugins/store/slices/search-query';
import { getPlaces } from '@services/api/projects';
import { useQuery } from '@tanstack/react-query';
import { ChildrenProps } from '@utils/interface/global-interface';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function MapSearchQuery() {
  const query = useSelector(selectQuery);
  const dispatch = useDispatch();

  const {
    data: queryResult,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ['searchQuery', query],
    queryFn: () => getPlaces(query),
    enabled: !!query,
  });

  const clearQueryCallback = useCallback(() => {
    dispatch(clearSearch());
  }, [dispatch]);

  const results = queryResult?.map((result) => (
    <MapSearchQueryItem key={result.id} {...result} />
  ));

  const displayResults = () => {
    if (isFetching && isLoading) {
      return (
        <NoData>
          <>{'Fetching'}</>
        </NoData>
      );
    }
    if (!results?.length) {
      return (
        <NoData>
          <>{'No Data'}</>
        </NoData>
      );
    }

    return results;
  };

  return (
    <div className={styles.root}>
      <button className={styles.clearButton} onClick={clearQueryCallback}>
        Clear Query
      </button>

      <div>{displayResults()}</div>
    </div>
  );
}

function NoData({ children }: ChildrenProps) {
  return <p className={styles.noData}>{children}</p>;
}

const styles = {
  root: 'rounded-lg w-full',
  clearButton: 'btn btn-primary btn-small w-full',
  noData:
    'w-full btn btn-secondary border-0 bg-transparent text-left justify-start h-fit py-4',
};
