import ScrollTopIcon from '@components/Icons/ScrollTopIcon';
// import ProjectCardSkeleton from '@components/layouts/ProjectCardSkeleton';
import ProjectCard from '@components/ProjectCard';
import { useFilters } from '@hooks/useFilters';
import { useIntersectionObserver } from '@hooks/useIntersectionObserver';
import {
  selectFilteredProjects,
  setFilteredProjects,
} from '@plugins/store/slices/projects';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function ProjectGrid() {
  const dispatch = useDispatch();
  const filteredProjects = useSelector(selectFilteredProjects);
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);

  const rootDivRef = useRef(null);
  const gridRef = useRef(null);

  const filters = useFilters();

  const observerOptions = useMemo(() => {
    return {
      rootMargin: '0px',
      threshold: [0.25, 0.5, 0.75, 1.0],
    };
  }, []);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        target.style.opacity = `${entry.intersectionRatio}`;
      });
    },
    []
  );

  const observer = useIntersectionObserver(
    rootDivRef.current,
    observerCallback,
    observerOptions
  );

  useEffect(() => {
    dispatch(setFilteredProjects(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    scrollToTop();
  }, [filters, rootDivRef]);

  useEffect(() => {
    if (!rootDivRef && !gridRef) return;
    const root = rootDivRef.current as unknown as HTMLDivElement;
    const grid = gridRef.current as unknown as HTMLDivElement;
    setShowScrollButton(grid.clientHeight > root.clientHeight);
  }, [filteredProjects]);

  const displayFilteredProjects = useMemo(() => {
    return filteredProjects.map((project) => (
      <ProjectCard key={project.farmId} project={project} observer={observer} />
    ));
  }, [filteredProjects, observer]);

  // const displaySkeleton = useMemo(() => {
  //   return Array(10)
  //     .fill(null)
  //     .map((_, idx) => <ProjectCardSkeleton key={idx} observer={observer} />);
  // }, [observer]);

  const scrollToTop = () => {
    const root = rootDivRef.current as unknown as HTMLDivElement;
    root.scrollTo(0, 0);
  };

  return (
    <div ref={rootDivRef} className={styles.root}>
      <div ref={gridRef} className={styles.grid}>
        {displayFilteredProjects}
        {showScrollButton && (
          <button className={styles.button} onClick={scrollToTop}>
            <ScrollTopIcon className={styles.icon} />
            Scroll To Top
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  root: 'h-full overflow-y-auto scroll-smooth',
  grid: 'grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3 pb-4',
  icon: 'h-5 w-5 fill-current',
  button:
    'btn btn-link no-underline mt-4 flex items-center gap-1 col-span-1 xl:col-span-2 2xl:col-span-3 hover:no-underline',
};
