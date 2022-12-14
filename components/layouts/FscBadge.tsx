import CheckIcon from '@components/Icons/CheckIcon';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  outerClass: string;
  iconClass: string;
}

FscBadge.defaultProps = {
  outerClass: '',
  iconClass: '',
};

export default function FscBadge({ outerClass, iconClass }: Props) {
  return (
    <div className={twMerge(styles.certificationBadge, outerClass)}>
      <CheckIcon className={twMerge(styles.badgeIcon, iconClass)} />
      <p>FSC</p>
    </div>
  );
}

const styles = {
  certificationBadge: 'badge badge-success badge-xs grow-0 gap-1 p-2',
  badgeIcon: 'h-3 w-3 fill-current',
};
