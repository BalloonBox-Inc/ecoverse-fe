import SideNavItem from '@components/layouts/SideNavItem';
import { ClassNameProps } from '@utils/global-interface';
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
      <div>
        <div className="divider"></div>
        <SideNavItem
          navItem={navList[navList.length - 1]}
          className="justify-self-end"
        />
      </div>
    </ul>
  );
}

const styles = {
  root: 'flex flex-col justify-between py-8 w-nav bg-accent h-full',
  itemList: 'flex flex-col gap-4 ',
};