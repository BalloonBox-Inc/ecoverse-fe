import { ClassNameProps } from '@utils/global-interface';
import { NavItem } from '@utils/side-navigation';
import Link from 'next/link';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface Props extends ClassNameProps {
  navItem: NavItem;
}

export default function SideNavItem({ className, navItem }: Props) {
  return (
    <li
      key={navItem.label}
      className={twMerge(styles.item, className)}
      data-tip={navItem.label}
    >
      <Link href={navItem.href}>
        <navItem.Icon className={styles.icon} />
      </Link>
    </li>
  );
}

const styles = {
  item: 'btn btn-accent flex items-center tooltip tooltip-right',
  icon: 'fill-current w-6 h-6',
};