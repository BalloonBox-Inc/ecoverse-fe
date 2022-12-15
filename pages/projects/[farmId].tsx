import FarmStats from '@components/FarmStats';
import ChevronLeftIcon from '@components/Icons/ChevronLeftIcon';
import ChevronRightIcon from '@components/Icons/ChevronRightIcon';
import Layout from '@components/layouts/Layout';
import ProjectsFscBadge from '@components/ProjectsFscBadge';
import ProjectsStatusBadge from '@components/ProjectsStatusBadge';
import { getProjectByFarmId } from '@services/api/projects';
import { getStaticImageUrl } from '@services/map';
import { DAILY, DATA_URL_PLACEHOLDER } from '@utils/constants';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { twMerge } from 'tailwind-merge';

interface StaticParams extends ParsedUrlQuery {
  farmId: string;
}

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function Farm({ project }: Props) {
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
    status,
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
              {certifiedFSC && <ProjectsFscBadge />}
              <button className={styles.flyToButton} onClick={handleFlyTo}>
                Go to Location
                <ChevronRightIcon className={styles.chevronIcon} />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.bodyContent}>
          <figure className={styles.figure}>
            <div className={styles.image}>
              <Image
                src={imageUrl}
                alt={project.province}
                fill
                placeholder="blur"
                blurDataURL={DATA_URL_PLACEHOLDER}
              />
            </div>
          </figure>
          <div className={styles.cardBody}>
            <p className={styles.title}>{country}</p>
            <ProjectsStatusBadge status={status} />
            <p>Resources: {resource}</p>

            <div className={styles.statsContainer}>
              {stats.map((stat) => (
                <FarmStats key={stat.label} {...stat} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const { farmId } = params as StaticParams;
    const project = await getProjectByFarmId(farmId);
    return {
      props: { project },
      revalidate: DAILY,
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
  figure: 'bg-gradient-to-br from-success to-secondary',
  image: 'h-72 aspect-[4/3] relative inline overflow-hidden',
  headerContainer: 'card card-compact rounded-none',
  headerContent: 'flex flex-col w-full justify-evenly sm:flex-row',
  cardBody: 'card-body',
  badgeContainer:
    'flex justify-between items-center px-4 pb-4 sm:items-end sm:p-4 sm:flex-col',
  badge: 'order-3 badge-md md:order-1 lg:p-2',
  bodyContent: 'card shadow-lg lg:card-side',
  justifyEnd: 'justify-end',
  flyToButton: 'btn btn-primary btn-xs no-underline gap-1 order-2',
  title: 'card-title',
  statsContainer:
    'grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 justify-items-start gap-2',
};
