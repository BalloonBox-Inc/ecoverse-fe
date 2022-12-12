import Layout from '@components/layouts/Layout';
import ProjectsContent from '@components/ProjectsContent';
import ProjectsFilterTab from '@components/ProjectsFilterTab';
import { setQueriedProjects } from '@plugins/store/slices/projects';
import { getProjects, QueriedProjects } from '@services/api/projects';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

interface Props {
  projects: QueriedProjects;
}

export default function Projects({ projects }: Props) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setQueriedProjects(projects));
  }, [dispatch, projects]);

  return (
    <Layout>
      <div className={styles.root}>
        <input id="projects-tab" type="checkbox" className={styles.toggler} />
        <div className={styles.drawerContent}>
          <ProjectsContent />
        </div>
        <div className={styles.drawerSide}>
          <label
            htmlFor="projects-tab"
            className={styles.drawerOverlay}
          ></label>
          <div className={styles.drawerSideContent}>
            <ProjectsFilterTab />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const projects = await getProjects();

  return {
    props: {
      projects,
    },
    revalidate: 60 * 60 * 24, // revalidate after one day
  };
}

const styles = {
  root: 'drawer drawer-mobile h-custom-y-screen',
  toggler: 'drawer-toggle',
  drawerContent: 'drawer-content h-custom-y-screen',
  drawerSide: 'drawer-side',
  drawerOverlay: 'drawer-overlay',
  drawerSideContent:
    'menu bg-base-100 max-w-xs w-custom-x-screen p-2 rounded-r-lg border-2 shadow-inner z-1 lg:border-none lg:shadow-none lg:rounded-tl-lg lg:border-2',
};
