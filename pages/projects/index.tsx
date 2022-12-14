import Layout from '@components/layouts/Layout';
import ProjectsContent from '@components/ProjectsContent';
import ProjectsFilterTab from '@components/ProjectsFilterTab';
import { useFilters } from '@hooks/useFilters';
import {
  setFilteredProjects,
  setIsFetching,
  setQueriedProjects,
} from '@plugins/store/slices/projects';
import { getProjects } from '@services/api/projects';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function Projects() {
  const dispatch = useDispatch();
  const filters = useFilters();

  const { data: projects, isLoading: isProjectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (projects) {
      dispatch(setQueriedProjects(projects));
      dispatch(setFilteredProjects(filters));
    }
  }, [dispatch, filters, projects]);

  useEffect(() => {
    dispatch(setIsFetching(isProjectsLoading));
  }, [dispatch, isProjectsLoading]);

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

const styles = {
  root: 'drawer drawer-mobile h-custom-y-screen',
  toggler: 'drawer-toggle',
  drawerContent: 'drawer-content h-custom-y-screen relative',
  drawerSide: 'drawer-side',
  drawerOverlay: 'drawer-overlay',
  drawerSideContent:
    'menu bg-base-100 max-w-xs w-custom-x-screen p-2 rounded-r-lg border-2 shadow-inner z-1 lg:border-none lg:shadow-none lg:rounded-tl-lg lg:border-2',
};
