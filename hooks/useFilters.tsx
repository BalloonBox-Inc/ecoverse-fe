import {
  Filter,
  FilterParams,
  selectFilters,
} from '@plugins/store/slices/filter';
import { selectQuery } from '@plugins/store/slices/search-query';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useFilters = () => {
  const filtersFromStore = useSelector(selectFilters);
  const search = useSelector(selectQuery);

  const filters = useMemo(() => {
    const filtersToReturn = Object.entries(filtersFromStore).reduce(
      (acc: FilterParams, filter) => {
        if (filter[1] !== undefined) {
          acc[filter[0] as Filter] = filter[1];
        }
        return acc;
      },
      {}
    );

    if (search) {
      filtersToReturn.search = search;
    }

    return filtersToReturn;
  }, [filtersFromStore, search]);

  return filters;
};
