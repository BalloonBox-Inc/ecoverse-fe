import SearchIcon from '@components/Icons/SearchIcon';
import TileIcon from '@components/Icons/TileIcon';
import MapSearchQuery from '@components/MapSearchQuery';
import MapSelectDetails from '@components/MapSelectDetails';
import { selectHasSelectedTiles } from '@plugins/store/slices/map';
import { selectHasQuery } from '@plugins/store/slices/search-query';
import React from 'react';
import { useSelector } from 'react-redux';
import { twMerge } from 'tailwind-merge';

export default function MapSecondaryNav() {
  const hasSelectedTiles = useSelector(selectHasSelectedTiles);
  const hasQuery = useSelector(selectHasQuery);

  const emptyTabs = !hasQuery && !hasSelectedTiles && styles.noTabs;

  return (
    <>
      <div className={twMerge(styles.tabs, emptyTabs)}>
        {hasQuery && (
          <button className={styles.tab}>
            <SearchIcon className={styles.icon} />
          </button>
        )}
        {hasSelectedTiles && (
          <button className={twMerge(styles.tab, styles.tabActive)}>
            <TileIcon className={styles.icon} />
          </button>
        )}
      </div>
      <div className={styles.detailsContainer}>
        {hasQuery && <MapSearchQuery />}
        {hasSelectedTiles && <MapSelectDetails />}
      </div>
    </>
  );
}

const styles = {
  tabs: 'tabs tabs-boxed bg-secondary flex-nowrap w-fit rounded-bl-none rounded-br-none absolute',
  tab: 'tab tab-sm',
  tabActive: 'tab-active',
  icon: 'h-4 w-4 fill-inherit',
  noTabs: 'p-0',
  detailsContainer:
    'w-custom-x-screen-2 max-w-lg absolute top-12 bg-secondary rounded-b-lg rounded-tr-lg',
};
