import SideNavItem from '@components/SideNavItem';
import { ClassNameProps } from '@utils/interface/global-interface';
import { navList } from '@utils/side-navigation';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

export default function SideNav({ className }: ClassNameProps) {
  const displayItems = useMemo(() => {
    return navList
      .slice(0, -1)
      .map((item) => <SideNavItem key={item.label} navItem={item} />);
  }, []);
  const router = useRouter();

  return (
    <ul className={twMerge(styles.root, className)}>
      <div className={styles.itemList}>
        <>{displayItems}</>
      </div>
      <SideNavItem navItem={navList[navList.length - 1]} />
    </ul>
  );
}

const styles = {
  root: `flex flex-col justify-between py-8 w-nav h-full bg-primary/40 backdrop-blur`,
  itemList: 'flex flex-col gap-4 items-center',
  extraMenu: 'flex flex-col items-center',
  divider: 'divider before:bg-secondary after:bg-secondary',
};
