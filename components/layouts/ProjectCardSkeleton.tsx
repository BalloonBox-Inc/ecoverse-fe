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
          <Skeleton />
        </div>

        <Skeleton count={4} />
      </div>
    </div>
  );
}

const styles = {
  root: 'card shadow-lg text-sm border-2 border-accent/20',
  content: 'card-body',
  headerContent: 'pb-2 border-b-2 border-info',
};
