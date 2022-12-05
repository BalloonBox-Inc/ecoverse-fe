import SearchIcon from '@components/Icons/SearchIcon';
import TileIcon from '@components/Icons/TileIcon';
import MapSearchQuery from '@components/MapSearchQuery';
import MapSelectDetails from '@components/MapSelectDetails';
import { selectHasSelectedTiles } from '@plugins/store/slices/map';
import { selectHasQuery } from '@plugins/store/slices/search-query';
import { navEventBus } from '@services/event-bus/secondary-nav';
import React, { MouseEventHandler } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { twMerge } from 'tailwind-merge';

export default function MapSecondaryNav() {
  const hasSelectedTiles = useSelector(selectHasSelectedTiles);
  const hasQuery = useSelector(selectHasQuery);
  const [showSearch, setShowSearch] = useState<boolean>(hasQuery);

  const emptyTabs = !hasQuery && !hasSelectedTiles && styles.noTabs;

  const handleShowSearch: MouseEventHandler<HTMLButtonElement> = () => {
    setShowSearch(true);
  };

  const handleShowSelectedTiles: MouseEventHandler<HTMLButtonElement> = () => {
    setShowSearch(false);
  };

  useEffect(() => {
    navEventBus.on('onShowSearch', setShowSearch);

    return () => {
      navEventBus.off('onShowSearch', setShowSearch);
    };
  }, []);

  useEffect(() => {
    setShowSearch(hasQuery);
  }, [hasQuery]);

  useEffect(() => {
    setShowSearch(!hasSelectedTiles);
  }, [hasSelectedTiles]);

  return (
    <>
      <div className={twMerge(styles.tabs, emptyTabs)}>
        {hasQuery && (
          <button
            className={twMerge(styles.tab, showSearch && styles.tabActive)}
            onClick={handleShowSearch}
          >
            <SearchIcon className={styles.icon} />
          </button>
        )}
        {hasSelectedTiles && (
          <button
            className={twMerge(styles.tab, !showSearch && styles.tabActive)}
            onClick={handleShowSelectedTiles}
          >
            <TileIcon className={styles.icon} />
          </button>
        )}
      </div>
      <div className={styles.detailsContainer}>
        {hasQuery && showSearch && <MapSearchQuery />}
        {hasSelectedTiles && !showSearch && <MapSelectDetails />}
      </div>
    </>
  );
}

const styles = {
  tabs: 'tabs tabs-boxed bg-secondary flex-nowrap w-fit rounded-bl-none rounded-br-none absolute',
  tab: 'tab tab-sm',
  tabActive: 'tab-active',
  icon: 'h-4 w-4 fill-current',
  noTabs: 'p-0',
  detailsContainer:
    'w-custom-x-screen-2 max-w-sm absolute top-12 bg-secondary rounded-b-lg rounded-tr-lg',
};
