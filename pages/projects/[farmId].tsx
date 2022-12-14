import ChevronLeftIcon from '@components/Icons/ChevronLeftIcon';
import ChevronRightIcon from '@components/Icons/ChevronRightIcon';
import FscBadge from '@components/layouts/FscBadge';
import Layout from '@components/layouts/Layout';
import { getProjectByFarmId, QueriedProjects } from '@services/api/projects';
import { getStaticImageUrl } from '@services/map';
import { placeholderDataUrl } from '@utils/helper';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { twMerge } from 'tailwind-merge';

interface StaticParams extends ParsedUrlQuery {
  farmId: string;
}

interface Props {
  project: QueriedProjects[0];
}

export default function Farm({ project }: Props) {
  const router = useRouter();
  const { longitude, latitude, province, country, groupScheme, certifiedFSC } =
    project;

  const imageUrl = getStaticImageUrl(longitude, latitude);

  const backButtonHandler = () => {
    router.back();
  };

  const handleFlyTo = () => {
    router.push({
      pathname: '/',
      query: {
        lng: longitude,
        lat: latitude,
      },
    });
  };

  return (
    <Layout>
      <div className={styles.root}>
        <button className={styles.backButton} onClick={backButtonHandler}>
          <ChevronLeftIcon className={styles.chevronIcon} /> Back
        </button>
        <div className={styles.headerContainer}>
          <figure>
            <div className={styles.image}>
              <Image
                src={imageUrl}
                alt={project.province}
                fill
                placeholder="blur"
                blurDataURL={placeholderDataUrl}
              />
            </div>
          </figure>
          <div className={styles.headerContent}>
            <div className={styles.cardBody}>
              <h1>{province}</h1>
              <p>{groupScheme}</p>
            </div>
            <div
              className={twMerge(
                styles.badgeContainer,
                !certifiedFSC && styles.justifyEnd
              )}
            >
              {certifiedFSC && <FscBadge outerClass={styles.badge} />}
              <button className={styles.flyToButton} onClick={handleFlyTo}>
                Go to Location
                <ChevronRightIcon className={styles.chevronIcon} />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.bodyContent}>
          <div className={styles.cardBody}>{country}</div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { farmId } = params as StaticParams;
  const project = await getProjectByFarmId(farmId);

  return !project
    ? { notFound: true }
    : {
        props: { project },
      };
};

const styles = {
  root: 'container my-4 mx-auto h-custom-y-screen-2 flex flex-col justify-stretch gap-2 h-full md:gap-4',
  backButton:
    'btn btn-link no-underline w-fit gap-1 hover:no-underline hover:border-primary',
  chevronIcon: 'h-3 w-3 fill-current',
  image: 'w-20 h-20 relative rounded-lg overflow-hidden',
  headerContainer: 'card card-side card-compact rounded-none',
  headerContent: 'flex flex-col w-full justify-evenly md:flex-row',
  cardBody: 'card-body',
  badgeContainer: 'flex justify-between items-end px-4 pb-4 md:p-4 md:flex-col',
  badge: 'lg:badge-md lg:p-2',
  bodyContent: 'card border-accent/20 border-2 shadow-lg',
  justifyEnd: 'justify-end',
  flyToButton: 'btn btn-primary btn-xs no-underline gap-1',
};
