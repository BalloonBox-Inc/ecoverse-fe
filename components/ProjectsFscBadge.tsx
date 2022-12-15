import CheckIcon from '@components/Icons/CheckIcon';
import Badge from '@components/layouts/Badge';
import { twMerge } from 'tailwind-merge';

interface Props {
  outerClass: string;
  iconClass: string;
}

ProjectsFscBadge.defaultProps = {
  outerClass: '',
  iconClass: '',
};

export default function ProjectsFscBadge({ outerClass, iconClass }: Props) {
  return (
    <Badge className={twMerge(styles.root, outerClass)}>
      <CheckIcon className={twMerge(styles.badgeIcon, iconClass)} />
      <p>FSC</p>
    </Badge>
  );
}

const styles = {
  root: 'badge-success badge-xs p-2',
  badgeIcon: 'h-3 w-3 fill-current',
};
