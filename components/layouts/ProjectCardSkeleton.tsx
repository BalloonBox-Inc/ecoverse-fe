import 'react-loading-skeleton/dist/skeleton.css';

import { useEffect, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';

interface Props {
  observer: IntersectionObserver | null;
}

export default function ProjectCardSkeleton({ observer }: Props) {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef) return;
    const cardDiv = cardRef.current as unknown as HTMLElement;
    observer?.observe(cardDiv);

    return () => {
      observer?.unobserve(cardDiv);
    };
  }, [cardRef, observer]);

  return (
    <div ref={cardRef} className={styles.root}>
      <div className={styles.content}>
        <div className={styles.headerContent}>
          <Skeleton className={styles.headerSkeleton} />
        </div>

        <Skeleton count={4} className={styles.contentSkeleton} />

        <div className={styles.placeholderButton}>
          {' '}
          <Skeleton className={styles.buttonSkeleton} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: 'card shadow-lg text-sm border-2 border-accent/20',
  content: 'card-body',
  headerContent: 'pb-2 border-b-2 border-info',
  headerSkeleton: 'h-8',
  contentSkeleton: 'h-5',
  placeholderButton: 'w-full md:w-32 mt-6 md:self-end md:mt-0',
  buttonSkeleton: 'h-8',
};
