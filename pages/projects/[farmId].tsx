import ChevronLeftIcon from '@components/Icons/ChevronLeftIcon';
import ChevronRightIcon from '@components/Icons/ChevronRightIcon';
import FscBadge from '@components/layouts/FscBadge';
import Layout from '@components/layouts/Layout';
import { getProjectByFarmId } from '@services/api/projects';
import { getStaticImageUrl } from '@services/map';
import { placeholderDataUrl } from '@utils/helper';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { twMerge } from 'tailwind-merge';

interface StaticParams extends ParsedUrlQuery {
  farmId: string;
}

export default function Farm({
  project,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    longitude,
    latitude,
    province,
    country,
    resource,
    groupScheme,
    certifiedFSC,
    farmSize,
    effectiveArea,
    sphaSurvival,
    plantAge,
    carbonSequesteredPerYear,
    carbonSequesteredPerDay,
  } = project;

  const router = useRouter();

  const backButtonHandler = () => {
    router.push('/projects');
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

  const imageUrl = getStaticImageUrl(longitude, latitude);

  const stats = [
    {
      label: 'Farm Size',
      value: farmSize,
    },
    {
      label: 'Effective Area',
      value: effectiveArea,
    },
    {
      label: 'Spha Survival',
      value: sphaSurvival,
    },
    {
      label: 'Plant Age',
      value: plantAge,
    },
    {
      label: 'Carbon Sequestered (yr)',
      value: carbonSequesteredPerYear,
    },
    {
      label: 'Carbon Sequestered (day)',
      value: carbonSequesteredPerDay,
    },
  ];

  return (
    <Layout>
      <div className={styles.root}>
        <button className={styles.backButton} onClick={backButtonHandler}>
          <ChevronLeftIcon className={styles.chevronIcon} /> Back
        </button>
        <div className={styles.headerContainer}>
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
          <figure className="bg-gradient-to-br from-success to-secondary">
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
          <div className={styles.cardBody}>
            <p className={styles.title}>{country}</p>
            <p className="grow-0">Resources: {resource}</p>
            <p className="grow-0">Farm Stats</p>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 justify-items-start gap-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-1 items-start justify-between w-full"
                >
                  <p>{stat.label}</p>
                  <p className="text-sm">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const { farmId } = params as StaticParams;
    const project = await getProjectByFarmId(farmId);
    return {
      props: { project },
    };
  } catch (e) {
    return { notFound: true };
  }
};

const styles = {
  root: 'container my-4 mx-auto h-custom-y-screen-2 flex flex-col justify-stretch gap-2 h-full md:gap-4',
  backButton:
    'btn btn-link no-underline w-fit gap-1 hover:no-underline hover:border-primary',
  chevronIcon: 'h-3 w-3 fill-current',
  image: 'h-72 aspect-[4/3] relative inline overflow-hidden',
  headerContainer: 'card card-compact rounded-none',
  headerContent: 'flex flex-col w-full justify-evenly md:flex-row',
  cardBody: 'card-body',
  badgeContainer:
    'flex justify-between items-center px-4 pb-4 md:items-end md:p-4 md:flex-col',
  badge: 'order-3 badge-md md:order-1 lg:p-2',
  bodyContent: 'card shadow-lg lg:card-side',
  justifyEnd: 'justify-end',
  flyToButton: 'btn btn-primary btn-xs no-underline gap-1 order-2',
  title: 'card-title',
};
