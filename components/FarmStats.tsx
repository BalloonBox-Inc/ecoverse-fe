import FarmStatItem from '@components/FarmStatItem';
import { QueriedProject } from '@services/api/projects';

interface Props {
  project: QueriedProject;
}

export default function FarmStats({ project }: Props) {
  const { farmSize, effectiveArea, treesPlanted, plantAge, farmCo2y } = project;

  const stats = [
    {
      label: 'Farm Size',
      value: farmSize,
      desc: 'hectares',
    },
    {
      label: 'Effective Area',
      value: effectiveArea,
      desc: 'hectares',
    },
    {
      label: 'Trees Planted',
      value: treesPlanted,
      desc: 'estimated trees per farm',
    },
    {
      label: 'Plant Age',
      value: plantAge,
      desc: 'years',
    },
    {
      label: 'Carbon Sequestered',
      value: farmCo2y,
      desc: 'tons/ha per year',
    },
  ];

  const displayStats = stats.map((stat, idx) => (
    <FarmStatItem key={idx} {...stat} />
  ));

  return <div className={styles.root}>{displayStats}</div>;
}

const styles = {
  root: 'stats grid-flow-row grid-cols-1 xs:grid-cols-2 md:grid-cols-3 ',
};
