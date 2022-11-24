import MapSearchQueryItem from '@components/MapSearchQueryItem';
import { getPlaces } from '@services/map';
import { useQuery } from '@tanstack/react-query';
import { ChildrenProps } from '@utils/interface/global-interface';
import React from 'react';

interface Props {
  query: string;
  clearQueryCallback: React.MouseEventHandler<HTMLButtonElement>;
}

export default function MapSearchQuery({ query, clearQueryCallback }: Props) {
  const { data: queryResult, isLoading: queryLoading } = useQuery({
    queryKey: ['searchQuery', query],
    queryFn: () => getPlaces(query),
    enabled: !!query,
  });

  console.log({ queryResult });

  const results = queryResult?.map((result) => (
    <MapSearchQueryItem key={result.id} {...result} />
  ));

  const displayResults = () => {
    if (queryLoading) {
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
  root: 'bg-secondary/80 backdrop-blur shadow-xl fixed top-20 right-4 w-72',
  clearButton: 'btn btn-primary bt-small w-full',
  noData:
    'w-full btn btn-secondary border-0 bg-transparent text-left justify-start h-fit py-4',
};
