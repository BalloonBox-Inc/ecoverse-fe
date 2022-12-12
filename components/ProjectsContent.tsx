import FilterIcon from '@components/Icons/FilterIcon';
import ProjectFilterButtons from '@components/ProjectFilterButtons';
import ProjectGrid from '@components/ProjectGrid';
import { useFilters } from '@hooks/useFilters';
import {
  selectFilteredProjectsCount,
  selectQueriedProjectsCount,
  setFilteredProjects,
} from '@plugins/store/slices/projects';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function ProjectsContent() {
  const dispatch = useDispatch();
  const filteredProjectsCount = useSelector(selectFilteredProjectsCount);
  const queriedProjectsCount = useSelector(selectQueriedProjectsCount);
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
        <div className={styles.headerMain}>
          <label htmlFor="projects-tab" className={styles.button}>
            <FilterIcon className={styles.icon} />
          </label>
          <h1>Projects</h1>
        </div>

        <p className={styles.counter}>
          {filteredProjectsCount}/{queriedProjectsCount}
        </p>
      </div>

      <ProjectFilterButtons />

      <div ref={projectGridRef} className={styles.contentContainer}>
        <ProjectGrid />
      </div>
    </div>
  );
}

const styles = {
  root: 'h-full w-full py-4 px-2 flex flex-col gap-4 justify-items-stretch md:px-4',
  headerContainer: 'flex justify-between items-center',
  headerMain: 'flex items center',
  counter: 'justify-self-end',
  contentContainer: 'h-full overflow-y-auto scroll-smooth',
  button: 'btn btn-ghost btn-xs drawer-button lg:hidden hover:bg-transparent',
  icon: 'h-4 w-4 fill-current',
};

// todo: maybe add observer here? opacity 0 when out of view
