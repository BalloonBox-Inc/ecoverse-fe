import AreaIcon from '@components/Icons/AreaIcon';
import SearchIcon from '@components/Icons/SearchIcon';
import TileIcon from '@components/Icons/TileIcon';
import MapSearchQuery from '@components/MapSearchQuery';
import MapSelectArea from '@components/MapSelectArea';
import MapSelectDetails from '@components/MapSelectDetails';
import {
  selectHasSelectedArea,
  selectHasSelectedTiles,
} from '@plugins/store/slices/map';
import { selectHasQuery } from '@plugins/store/slices/search-query';
import React, { MouseEventHandler } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { twMerge } from 'tailwind-merge';

export default function MapSecondaryNav() {
  const hasSelectedTiles = useSelector(selectHasSelectedTiles);
  const hasQuery = useSelector(selectHasQuery);
  const hasSelectedArea = useSelector(selectHasSelectedArea);

  const [showSearch, setShowSearch] = useState<boolean>(hasQuery);
  const [showSelectedTiles, setShowSelectedTiles] =
    useState<boolean>(hasSelectedTiles);
  const [showSelectedArea, setShowSelectedArea] =
    useState<boolean>(hasSelectedArea);

  const emptyTabs =
    !hasQuery && !hasSelectedTiles && !hasSelectedArea && styles.noTabs;
  const hideTabs =
    !showSearch && !showSelectedTiles && !showSelectedArea && styles.hideTabs;

  const handleShowSearch: MouseEventHandler<HTMLButtonElement> = () => {
    setShowSearch((prev) => !prev);
    if (showSelectedTiles) setShowSelectedTiles(false);
    if (showSelectedArea) setShowSelectedArea(false);
  };

  const handleShowSelectedTiles: MouseEventHandler<HTMLButtonElement> = () => {
    setShowSelectedTiles((prev) => !prev);
    if (showSearch) setShowSearch(false);
    if (showSelectedArea) setShowSelectedArea(false);
  };

  const handleShowSelectedArea: MouseEventHandler<HTMLButtonElement> = () => {
    setShowSelectedArea((prev) => !prev);
    if (showSearch) setShowSearch(false);
    if (showSelectedTiles) setShowSelectedTiles(false);
  };

  // * I don't like this. Need to refactor

  useEffect(() => {
    setShowSearch(hasQuery);
    setShowSelectedTiles(!hasQuery);
    setShowSelectedArea(!hasQuery);
  }, [hasQuery]);

  useEffect(() => {
    setShowSelectedTiles(hasSelectedTiles);
    setShowSearch(!hasSelectedTiles);
    setShowSelectedArea(!hasSelectedTiles);
  }, [hasSelectedTiles]);

  useEffect(() => {
    setShowSelectedArea(hasSelectedArea);
    setShowSelectedTiles(!hasSelectedArea);
    setShowSearch(!hasSelectedArea);
  }, [hasSelectedArea]);

  return (
    <>
      <div className={twMerge(styles.tabs, hideTabs, emptyTabs)}>
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
            className={twMerge(
              styles.tab,
              showSelectedTiles && styles.tabActive
            )}
            onClick={handleShowSelectedTiles}
          >
            <TileIcon className={styles.icon} />
          </button>
        )}
        {hasSelectedArea && (
          <button
            className={twMerge(
              styles.tab,
              showSelectedArea && styles.tabActive
            )}
            onClick={handleShowSelectedArea}
          >
            <AreaIcon className={styles.icon} />
          </button>
        )}
      </div>
      <div className={styles.detailsContainer}>
        {hasQuery && showSearch && <MapSearchQuery />}
        {hasSelectedTiles && showSelectedTiles && <MapSelectDetails />}
        {hasSelectedArea && showSelectedArea && <MapSelectArea />}
      </div>
    </>
  );
}

const styles = {
  tabs: 'tabs tabs-boxed w-fit rounded-r-none absolute gap-2 py-2 bg-base-100/90',
  hideTabs: 'rounded-lg',
  tab: 'tab tab-sm',
  tabActive: 'tab-active',
  icon: 'h-4 w-4 fill-current',
  noTabs: 'p-0',
  detailsContainer:
    'w-custom-x-screen-2 max-w-sm absolute top-4 left-12 bg-base-100/90 rounded-b-lg rounded-tr-lg',
};
