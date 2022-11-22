import MenuIcon from '@components/Icons/MenuIcon';
import MenuIconClose from '@components/Icons/MenuIconClose';
import Header from '@components/layouts/Header';
import SideNav from '@components/layouts/SideNav';
import { ChildrenProps } from '@utils/global-interface';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

export default function MapLayout({ children }: ChildrenProps) {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const toggleHandler = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setShowMenu(target.checked);
  };

  const displayMenu = showMenu ? 'z-10 opacity-100' : '-z-10 opacity-0';

  return (
    <>
      <div className={styles.topNav}>
        <label className={styles.label}>
          <input type="checkbox" onChange={toggleHandler} />

          <MenuIcon className={styles.menuIcon} />
          <MenuIconClose className={styles.menuIconClose} />
        </label>

        <div className={twMerge(styles.header, displayMenu)}>
          <Header className={styles.custom} />
        </div>
      </div>

      <div className={twMerge(styles.sideNav, displayMenu)}>
        <SideNav className={styles.custom} />
      </div>
      <>{children}</>
    </>
  );
}

const styles = {
  topNav: 'flex gap-4 w-full',
  header: 'w-full rounded-lg transition-all',
  custom: 'rounded-lg',
  label: 'btn btn-squircle btn-accent swap swap-rotate h-16 w-16',
  menuIcon: 'swap-off fill-current scale-50',
  menuIconClose: 'swap-on fill-current scale-50',
  sideNav: 'absolute mt-4  flex justify-center transition-all',
};
