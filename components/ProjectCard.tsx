import ChevronRightIcon from '@components/Icons/ChevronRightIcon';
import LocationIcon from '@components/Icons/LocationIcon';
import FscBadge from '@components/layouts/FscBadge';
import { QueriedProjects } from '@services/api/projects';
import { numFormat } from '@utils/helper';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

interface Props {
  project: QueriedProjects[0];
  observer: IntersectionObserver | null;
}

export default function ProjectCard({ project, observer }: Props) {
  const {
    farmId,
    province,
    groupScheme: group,
    country,
    productGroup: product,
    effectiveArea: size,
    longitude: lng,
    latitude: lat,
    status,
    certifiedFSC,
  } = project;

  const router = useRouter();

  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef) return;
    const cardDiv = cardRef.current as unknown as HTMLElement;
    observer?.observe(cardDiv);

    return () => {
      observer?.unobserve(cardDiv);
    };
  }, [cardRef, observer]);

  const handleFlyToLocation = () => {
    router.push({
      pathname: '/',
      query: {
        lng,
        lat,
      },
    });
  };

  const handleRoute = () => {
    router.push(`/projects/${farmId}`);
  };

  return (
    <div ref={cardRef} className={styles.root}>
      <div className={styles.content}>
        <div className={styles.headerContainer}>
          <div className={styles.headerContent}>
            <div className={styles.toolTip} data-tip={`Go to ${province}`}>
              <button onClick={handleFlyToLocation}>
                <LocationIcon className={styles.icon} />
              </button>
            </div>
            <h3 className={styles.header}>{province}</h3>
            <p>{group}</p>
          </div>
          {certifiedFSC && <FscBadge />}
        </div>

        <div>
          <p>Country: {country}</p>
          <p>Product: {product}</p>
          <p>Status: {status}</p>
          <p>Effective Area: {numFormat(size)} ha</p>
        </div>

        <button className={styles.routeButton} onClick={handleRoute}>
          more info <ChevronRightIcon className={styles.chevronRight} />
        </button>
      </div>
    </div>
  );
}

const styles = {
  root: 'card shadow-lg text-sm border-2 border-accent/20',
  content: 'card-body lg:gap-4',
  headerContainer:
    'flex flex-col items-start gap-1 pb-2 border-b-2 border-info text-xs md:flex-row md:items-center md:justify-between md:pb-0',
  headerContent: 'flex gap-1 justify-start items-baseline',
  toolTip: 'tooltip tooltip-right',
  icon: 'w-4 h-4 fill-current',
  header: 'card-title text-2xl',

  routeButton:
    'btn btn-primary btn-sm no-underline gap-1 mt-6 sm:w-fit sm:self-end sm:mt-0',
  chevronRight: 'h-3 w-3 fill-current',
};
