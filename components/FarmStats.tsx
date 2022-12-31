import FarmStatItem from '@components/FarmStatItem';
import { QueriedProject } from '@services/api/projects';

interface Props {
  project: QueriedProject;
}

export default function FarmStats({ project }: Props) {
  const {
    farmSize,
    effectiveArea,
    sphaSurvival,
    plantAge,
    carbonSequesteredPerYear,
    carbonSequesteredPerDay,
  } = project;

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
      label: 'Spha Survival',
      value: sphaSurvival,
      desc: 'stems per hectare',
    },
    {
      label: 'Plant Age',
      value: plantAge,
      desc: 'years',
    },
    {
      label: 'Carbon Sequestered',
      value: carbonSequesteredPerYear,
      desc: 'tons/ha per year',
    },
    {
      label: 'Carbon Sequestered',
      value: carbonSequesteredPerDay,
      desc: 'tons/ha per day',
    },
  ];

  const displayStats = stats.map((stat, idx) => (
    <FarmStatItem key={idx} {...stat} />
  ));

  return <div className={styles.root}>{displayStats}</div>;
}

const styles = {
  root: 'stats shadow-neumorphic-inset grid-flow-row grid-cols-1 xs:grid-cols-2 md:grid-cols-3 ',
};
