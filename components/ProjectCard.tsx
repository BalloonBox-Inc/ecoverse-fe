import CheckIcon from '@components/Icons/CheckIcon';
import LocationIcon from '@components/Icons/LocationIcon';
import { QueriedProjects } from '@services/api/projects';
import { numFormat } from '@utils/helper';
import { useRouter } from 'next/router';

interface Props {
  project: QueriedProjects[0];
}

export default function ProjectCard({ project }: Props) {
  const {
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

  const handleClick = () => {
    router.push({
      pathname: '/',
      query: {
        lng,
        lat,
      },
    });
  };

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.headerContainer}>
          <div className={styles.headerContent}>
            <div className={styles.toolTip} data-tip={`Go to ${province}`}>
              <button onClick={handleClick}>
                <LocationIcon className={styles.icon} />
              </button>
            </div>
            <h3 className={styles.header}>{province}</h3>
            <p>{group}</p>
          </div>
          {certifiedFSC && (
            <div className={styles.certificationBadge}>
              <CheckIcon className={styles.badgeIcon} />
              <p className={styles.badgeText}>FSC</p>
            </div>
          )}
        </div>

        <div>
          <p>Country: {country}</p>
          <p>Product: {product}</p>
          <p>Status: {status}</p>
          <p>Effective Area: {numFormat(size)} ha</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: 'card shadow-md text-sm bg-black/10',
  content: 'card-body',
  headerContainer:
    'flex flex-col items-start gap-1 pb-2 border-b-2 border-info text-xs md:flex-row md:items-center md:justify-between md:pb-0',
  headerContent: 'flex gap-1 justify-start items-baseline',
  toolTip: 'tooltip tooltip-right',
  icon: 'w-4 h-4 fill-current',
  header: 'card-title text-2xl',
  certificationBadge: 'badge badge-success badge-sm grow-0',
  badgeIcon: 'h-3 w-3 fill-current',
  badgeText: 'p-2',
};
