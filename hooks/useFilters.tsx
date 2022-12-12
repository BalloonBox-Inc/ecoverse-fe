import {
  Filter,
  FilterParams,
  selectFilters,
} from '@plugins/store/slices/filter';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useFilters = () => {
  const filtersFromStore = useSelector(selectFilters);

  const filters = useMemo(() => {
    return Object.entries(filtersFromStore).reduce(
      (acc: FilterParams, filter) => {
        if (filter[1] !== undefined) {
          acc[filter[0] as Filter] = filter[1];
        }
        return acc;
      },
      {}
    );
  }, [filtersFromStore]);

  return filters;
};
