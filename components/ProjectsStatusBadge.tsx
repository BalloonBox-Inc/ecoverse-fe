import Badge from '@components/layouts/Badge';
import { twMerge } from 'tailwind-merge';

interface Props {
  status: string;
}

interface Styles {
  [key: string]: string;
}

export default function ProjectsStatusBadge({ status }: Props) {
  const badgeStyle = styles[status.toLowerCase()];
  return (
    <>
      {badgeStyle && (
        <Badge className={twMerge(styles.root, badgeStyle)}>{status}</Badge>
      )}
    </>
  );
}

const styles: Styles = {
  root: 'uppercase badge-xs p-2',
  active: 'badge-success',
  inactive: 'badge-error',
};
