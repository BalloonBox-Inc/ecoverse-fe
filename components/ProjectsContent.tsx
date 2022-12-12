import FilterIcon from '@components/Icons/FilterIcon';
import ProjectFilterButtons from '@components/ProjectFilterButtons';
import ProjectGrid from '@components/ProjectGrid';
import { useFilters } from '@hooks/useFilters';
import {
  selectFilteredProjectsCount,
  selectIsFetching,
  selectQueriedProjectsCount,
  setFilteredProjects,
} from '@plugins/store/slices/projects';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function ProjectsContent() {
  const dispatch = useDispatch();
  const filteredProjectsCount = useSelector(selectFilteredProjectsCount);
  const queriedProjectsCount = useSelector(selectQueriedProjectsCount);
  const isFetching = useSelector(selectIsFetching);
  const filters = useFilters();

  const projectGridRef = useRef(null);

  useEffect(() => {
    dispatch(setFilteredProjects(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    const div = projectGridRef.current as unknown as HTMLDivElement;
    div.scrollTo(0, 0);
  }, [filters, projectGridRef]);

  return (
    <div className={styles.root}>
      <div className={styles.headerContainer}>
        <div className={styles.headerContext}>
          <div className={styles.headerMain}>
            <div className={styles.tooltip} data-tip="Filter">
              <label htmlFor="projects-tab" className={styles.button}>
                <FilterIcon className={styles.icon} />
              </label>
            </div>
            <h1>Projects</h1>
          </div>

          <p className={styles.counter}>
            {isFetching
              ? 'Loading...'
              : `Showing: ${filteredProjectsCount}/${queriedProjectsCount}`}
          </p>
        </div>

        <ProjectFilterButtons />
      </div>

      <div ref={projectGridRef} className={styles.contentContainer}>
        <ProjectGrid />
      </div>
    </div>
  );
}

const styles = {
  root: 'h-full w-full py-4 px-2 flex flex-col justify-items-stretch md:px-4',
  headerContainer: 'flex flex-col gap-2 pb-4',
  headerContext: 'flex justify-between items-center',
  headerMain: 'flex items-center',
  counter: 'text-sm',
  contentContainer: 'h-full overflow-y-auto scroll-smooth',
  button: 'btn btn-ghost btn-xs drawer-button lg:hidden hover:bg-transparent',
  icon: 'h-5 w-5 fill-current',
  tooltip: 'tooltip tooltip-bottom',
};

// todo: maybe add observer here? opacity 0 when out of view
