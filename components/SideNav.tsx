import SideNavItem from '@components/SideNavItem';
import { ClassNameProps } from '@utils/interface/global-interface';
import { navList } from '@utils/side-navigation';
import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

export default function SideNav({ className }: ClassNameProps) {
  const displayItems = useMemo(() => {
    return navList
      .slice(0, -1)
      .map((item) => <SideNavItem key={item.label} navItem={item} />);
  }, []);
  return (
    <ul className={twMerge(styles.root, className)}>
      <div className={styles.itemList}>
        <>{displayItems}</>
      </div>
      <div className={styles.extraMenu}>
        <div className={styles.divider}></div>
        <SideNavItem navItem={navList[navList.length - 1]} />
      </div>
    </ul>
  );
}

const styles = {
  root: 'flex flex-col justify-between py-8 w-nav bg-primary/80 backdrop-blur h-full',
  itemList: 'flex flex-col gap-4 items-center',
  extraMenu: 'flex flex-col items-center',
  divider: 'divider before:bg-secondary after:bg-secondary',
};
