import Header from '@components/Header';
import MenuIcon from '@components/Icons/MenuIcon';
import MenuIconClose from '@components/Icons/MenuIconClose';
import SideNav from '@components/SideNav';
import { ChildrenProps } from '@utils/global-interface';
import { useEffect } from 'react';
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
  const displayMenuButton = showMenu ? 'bg-accent' : '';

  return (
    <>
      <div className={styles.topNav}>
        <label className={twMerge(styles.label, displayMenuButton)}>
          <input ref={navRef} type="checkbox" onChange={toggleHandler} />

          <MenuIcon className={styles.menuIcon} />
          <MenuIconClose className={styles.menuIconClose} />
        </label>

        <div className={twMerge(styles.header, displayMenu)}>
          <Header className={styles.custom} />
        </div>
      </div>

      <div className={twMerge(styles.sideNav, displayMenu)}>
        <SideNav className={twMerge(styles.custom, styles.customSideNav)} />
      </div>
      <>{children}</>
    </>
  );
}

const styles = {
  topNav: 'flex gap-4 w-full',
  header: 'w-full rounded-lg transition-all',
  custom: 'rounded-lg',
  customSideNav: 'mt-4',
  label:
    'btn btn-squircle btn-accent border-none bg-accent/50 swap swap-rotate h-nav w-nav ',
  menuIcon: 'swap-off fill-current scale-50',
  menuIconClose: 'swap-on fill-current scale-50',
  sideNav: 'absolute h-custom-y-screen flex justify-center transition-all',
  showMenu: 'z-10 opacity-100',
  hideMenu: '-z-10 opacity-0',
};
