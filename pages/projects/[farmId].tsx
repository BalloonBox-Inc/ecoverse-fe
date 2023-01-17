import FarmResourcesInfo from '@components/FarmResourcesInfo';
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
    resource,
    groupScheme,
    certifiedFSC,
    status,
    speciesName,
    genusName,
  } = project;

  const router = useRouter();

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

  const imageUrl = getStaticImageUrl(longitude, latitude);

  return (
    <Layout>
      <div className={styles.root}>
        <button className={styles.backButton} onClick={backButtonHandler}>
          <ChevronLeftIcon className={styles.chevronIcon} /> Back
        </button>

        <div className={styles.bodyContent}>
          <figure className={styles.figure}>
            <div className={styles.imageContainer}>
              <Image
                src={imageUrl}
                alt={project.province}
                fill
                placeholder="blur"
                blurDataURL={DATA_URL_PLACEHOLDER}
                className={styles.image}
              />
            </div>
          </figure>
          <div className={twMerge(styles.cardBody, styles.cardBodyContent)}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderContent}>
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
              </div>
            </div>

            <ProjectsStatusBadge status={status} />
            <div className={styles.resourcesContainer}>
              <span>Resources: {resource} </span>
              <FarmResourcesInfo species={speciesName} genus={genusName} />
            </div>

            <FarmStats project={project} />
            <button className={styles.flyToButton} onClick={handleFlyTo}>
              Go to Location
              <ChevronRightIcon className={styles.chevronIcon} />
            </button>
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
  root: 'container my-4 mx-auto h-custom-y-screen-2 flex flex-col justify-stretch gap-2 h-full md:gap-4 font-figtree',
  backButton:
    'btn btn-link no-underline w-fit gap-1 hover:no-underline hover:border-primary',
  chevronIcon: 'h-3 w-3 fill-current',
  figure: 'w-full lg:w-2/3 xl:w-2/5',
  imageContainer:
    'w-full h-96 relative inline overflow-hidden overflow-none lg:h-full after:absolute after:z-10 after:bg-gradient-to-b after:from-transparent after:via-transparent after:to-base-100 after:content-[""] after:h-full after:w-full after:lg:bg-gradient-to-r',
  image: 'object-cover',
  headerContainer: 'card card-compact rounded-none',
  headerContent: 'flex flex-col w-full justify-evenly sm:flex-row',
  cardBody: 'card-body',
  cardBodyContent: 'z-20 -mt-16 lg:mt-0 lg:-ml-16 xl:-ml-20',
  cardHeader: 'flex items-start justify-between',
  cardHeaderContent: 'flex flex-col py-2',
  badgeContainer:
    'flex justify-between items-center px-4 pb-4 sm:items-end sm:p-4 sm:flex-col',
  badge: 'order-3 badge-md md:order-1 lg:p-2',
  bodyContent: 'card shadow-neumorphic lg:card-side',
  justifyEnd: 'justify-end',
  flyToButton: 'btn btn-primary btn-xs no-underline gap-1 order-2 my-4',
  title: 'card-title',
  resourcesContainer: 'flex justify-start items-center gap-1',
};
