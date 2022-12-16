import InfoIcon from '@components/Icons/InfoIcon';

interface Props {
  species: string;
  genus: string;
}

export default function FarmResourcesInfo({ species, genus }: Props) {
  return (
    <div className={styles.root}>
      <label tabIndex={0} className={styles.label}>
        <InfoIcon className={styles.icon} />
      </label>
      <div tabIndex={0} className={styles.dropdownContent}>
        <p>Species: {species}</p>
        <p>Genus: {genus}</p>
      </div>
    </div>
  );
}

const styles = {
  root: 'dropdown dropdown-bottom dropdown-end',
  label: 'btn btn-link p-0',
  icon: 'h-5 w-5 fill-info',
  dropdownContent:
    'dropdown-content p-2 shadow bg-info rounded-lg text-xs w-36 capitalize',
};
