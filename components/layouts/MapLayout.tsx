// import Header from '@components/Header';
import MenuIcon from '@components/Icons/MenuIcon';
import MenuIconClose from '@components/Icons/MenuIconClose';
import MapSearch from '@components/MapSearch';
import SideNav from '@components/SideNav';
import UserMenu from '@components/UserMenu';
import { ChildrenProps } from '@utils/interface/global-interface';
import React, { useEffect } from 'react';
import { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export default function MapLayout({ children }: ChildrenProps) {
  const navRef = useRef(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);

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

  return (
    <div className={styles.root}>
      <div className={styles.topNav}>
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
          <MapSearch />
          <UserMenu />
        </div>
      </div>

      <div className={twMerge(styles.sideNav, displaySideMenu)}>
        <SideNav className={twMerge(styles.custom, styles.customSideNav)} />
      </div>

      <>{children}</>
    </div>
  );
}

const styles = {
  root: 'relative',
  topNav: 'flex gap-4 w-full relative z-10',
  header:
    'w-full rounded-lg transition-all origin-left bg-primary/80 backdrop-blur flex justify-end items-center pr-4 gap-4',
  custom: 'rounded-lg shadow-lg',
  customSideNav: 'mt-4',
  label:
    'btn btn-squircle btn-primary bg-primary/80 backdrop-blur border-none swap swap-rotate h-nav w-nav ',
  menuIcon: 'swap-off fill-inherit scale-50',
  menuIconClose: 'swap-on fill-inherit scale-50',
  sideNav:
    'absolute z-10 h-custom-y-screen-2 flex justify-center transition-all origin-top',
  showMenu: 'scale-x-100',
  hideMenu: 'scale-x-0',
  showSideMenu: 'scale-y-100',
  hideSideMenu: 'scale-y-0',
};
