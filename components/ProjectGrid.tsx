import ProjectCardSkeleton from '@components/layouts/ProjectCardSkeleton';
import ProjectCard from '@components/ProjectCard';
import {
  selectFilteredProjects,
  selectIsFetching,
} from '@plugins/store/slices/projects';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export default function ProjectGrid() {
  const filteredProjects = useSelector(selectFilteredProjects);
  const isProjectsFetching = useSelector(selectIsFetching);

  const displayFilteredProjects = useMemo(() => {
    return filteredProjects.map((project) => (
      <ProjectCard key={project.farmId} project={project} />
    ));
  }, [filteredProjects]);

  const displaySkeleton = useMemo(() => {
    return Array(10)
      .fill(null)
      .map((_, idx) => <ProjectCardSkeleton key={idx} />);
  }, []);
  return (
    <div className={styles.root}>
      {isProjectsFetching ? displaySkeleton : displayFilteredProjects}
    </div>
  );
}

const styles = {
  root: 'grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3',
};
