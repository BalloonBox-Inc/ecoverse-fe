import FilterIcon from '@components/Icons/FilterIcon';
import {
  setQueriedProjects,
  setQueryLoading,
} from '@plugins/store/slices/projects';
import { getProjects } from '@services/api/projects';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function ProjectsContent() {
  const dispatch = useDispatch();
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => getProjects(),
    onSuccess(data) {
      dispatch(setQueriedProjects(data));
    },
  });

  console.log(projects);

  useEffect(() => {
    dispatch(setQueryLoading(isLoading));
  }, [dispatch, isLoading]);

  return (
    <div className={styles.root}>
      <div className={styles.headerContainer}>
        <label htmlFor="projects-tab" className={styles.button}>
          <FilterIcon className={styles.icon} />
        </label>
        <h1>Projects</h1>
      </div>
      <div className={styles.contentContainer}>{/* add list here */}</div>
    </div>
  );
}

const styles = {
  root: 'h-full py-4 px-2 flex flex-col gap-4 justify-items-stretch md:px-4',
  headerContainer: 'flex items-center',
  contentContainer: 'h-full overflow-y-auto',
  button: 'btn btn-ghost btn-xs drawer-button lg:hidden hover:bg-transparent',
  icon: 'h-4 w-4 fill-current',
};

// todo: maybe add observer here? opacity 0 when out of view
