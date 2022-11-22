import MapIcon from '@components/Icons/MapIcon';
import MyForestsIcon from '@components/Icons/MyForestsIcon';
import ProjectsIcon from '@components/Icons/ProjectsIcon';
import { ClassNameProps } from '@utils/global-interface';
import Link from 'next/link';
import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

const navList = [
  {
    label: 'Map',
    Icon: MapIcon,
    href: '/',
  },
  {
    label: 'Projects',
    Icon: ProjectsIcon,
    href: '/forests',
  },
  {
    label: 'My Forests',
    Icon: MyForestsIcon,
    href: '/forests',
  },
];

export default function SideNav({ className }: ClassNameProps) {
  const displayItems = useMemo(() => {
    return navList.map((item) => (
      <li key={item.label} className={styles.item} data-tip={item.label}>
        <Link href={item.href}>
          <item.Icon className={styles.icon} />
        </Link>
      </li>
    ));
  }, []);
  return (
    <ul className={twMerge(styles.root, className)}>
      <>{displayItems}</>
    </ul>
  );
}

const styles = {
  root: 'flex flex-col gap-4 py-8 w-16 bg-accent',
  item: 'btn btn-accent flex items-center tooltip tooltip-right',
  icon: 'fill-current w-6 h-6',
};
