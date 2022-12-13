// import Header from '@components/Header';
import MenuIcon from '@components/Icons/MenuIcon';
import MenuIconClose from '@components/Icons/MenuIconClose';
import MapZoomControl from '@components/layouts/MapZoomControl';
import PageLoader from '@components/layouts/PageLoader';
import Search from '@components/layouts/Search';
import MapSecondaryNav from '@components/MapSecondaryNav';
import SideNav from '@components/SideNav';
import UserMenu from '@components/UserMenu';
import { ChildrenProps } from '@utils/interface/global-interface';
import React, { useEffect } from 'react';
import { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export default function MapLayout({ children }: ChildrenProps) {
  const navRef = useRef(null);
  const [showMenu, setShowMenu] = useState<boolean>(true);

  useEffect(() => {
    const nav: HTMLInputElement | null = navRef.current;
    if (!nav) return setShowMenu(false);
    setShowMenu(!!(nav as HTMLInputElement).checked);
  }, []);

  const toggleHandler = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setShowMenu(target.checked);
  };

  const displayMenu = showMenu ? styles.showMenu : styles.hideMenu;
  const displaySideMenu = showMenu ? styles.showSideMenu : styles.hideSideMenu;
  const customTopNav = showMenu
    ? styles.topNavFullWidth
    : styles.topNavFitWidth;

  const customDetailPosition = showMenu
    ? styles.selectionCustom
    : styles.selectionDefault;

  return (
    <>
      <PageLoader />
      <div className={twMerge(styles.topNav, customTopNav)}>
        <label className={styles.label}>
          <input
            ref={navRef}
            type="checkbox"
            onChange={toggleHandler}
            defaultChecked
          />
          <MenuIcon className={styles.menuIcon} />
          <MenuIconClose className={styles.menuIconClose} />
        </label>

        <div className={twMerge(styles.header, displayMenu)}>
          <Search placeholder="Search map" />
          <UserMenu />
        </div>
      </div>

      <div className={twMerge(styles.sideNav, displaySideMenu)}>
        <SideNav className={twMerge(styles.custom, styles.customSideNav)} />
      </div>

      <div className={twMerge(styles.secondaryNav, customDetailPosition)}>
        <MapSecondaryNav />
      </div>

      <MapZoomControl />

      <>{children}</>
    </>
  );
}

const styles = {
  topNav: 'flex gap-4 relative z-10',
  topNavFullWidth: 'w-full',
  topNavFitWidth: 'w-nav',
  header:
    'w-full rounded-lg transition-all origin-left bg-primary/80 backdrop-blur flex justify-end items-center pr-4 gap-4',
  custom: 'rounded-lg shadow-lg',
  customSideNav: 'mt-4',
  label:
    'btn btn-squircle btn-ghost bg-primary/80 backdrop-blur border-none swap swap-rotate h-nav w-nav hover:bg-primary',
  menuIcon: 'swap-off fill-current scale-50',
  menuIconClose: 'swap-on fill-current scale-50',
  sideNav:
    'absolute z-10 h-custom-y-screen-2 flex justify-center transition-all origin-top',
  showMenu: 'scale-x-100 opacity-100',
  hideMenu: 'scale-x-0 opacity-0 overflow-hidden',
  showSideMenu: 'scale-y-100 opacity-100',
  hideSideMenu: 'scale-y-0 opacity-0 overflow-hidden',
  secondaryNav: 'absolute z-1 top-nav transition-all pt-4',
  selectionCustom: 'left-nav ml-4',
  selectionDefault: 'left-0 ml-0',
};
