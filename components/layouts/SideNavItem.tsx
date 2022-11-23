import { ClassNameProps } from '@utils/interface/global-interface';
import { NavItem } from '@utils/side-navigation';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface Props extends ClassNameProps {
  navItem: NavItem;
}

export default function SideNavItem({ className, navItem }: Props) {
  const router = useRouter();

  const isActive = router.route === navItem.href && styles.activeItem;
  return (
    <li
      className={twMerge(styles.item, isActive, className)}
      data-tip={navItem.label}
    >
      <Link href={navItem.href}>
        <navItem.Icon className={styles.icon} />
      </Link>
    </li>
  );
}

const styles = {
  item: 'btn btn-ghost flex items-center tooltip tooltip-right',
  activeItem: 'btn-active',
  icon: 'fill-current w-6 h-6',
};
