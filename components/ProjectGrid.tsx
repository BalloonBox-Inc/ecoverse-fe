import ProjectCard from '@components/ProjectCard';
import { selectFilteredProjects } from '@plugins/store/slices/projects';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export default function ProjectGrid() {
  const filteredProjects = useSelector(selectFilteredProjects);

  const displayFilteredProjects = useMemo(() => {
    return filteredProjects.map((project) => (
      <ProjectCard key={project.farmId} project={project} />
    ));
  }, [filteredProjects]);
  return <div className={styles.root}>{displayFilteredProjects}</div>;
}

const styles = {
  root: 'grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3',
};
