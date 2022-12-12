import 'react-loading-skeleton/dist/skeleton.css';

import Skeleton from 'react-loading-skeleton';

export default function ProjectCardSkeleton() {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.headerContent}>
          <Skeleton />
        </div>

        <Skeleton count={4} />
      </div>
    </div>
  );
}

const styles = {
  root: 'card shadow-md bg-black/10 text-sm',
  content: 'card-body',
  headerContent: 'pb-2 border-b-2 border-info',
};
