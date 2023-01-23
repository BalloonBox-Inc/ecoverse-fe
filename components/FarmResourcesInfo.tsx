import InfoIcon from '@components/Icons/InfoIcon';

interface Props {
  scientificName: string[];
}

export default function FarmResourcesInfo({ scientificName }: Props) {
  return (
    <div className={styles.root}>
      <label tabIndex={0} className={styles.label}>
        <InfoIcon className={styles.icon} />
      </label>
      <div tabIndex={0} className={styles.dropdownContent}>
        <p>Genus Species:</p>
        <ul>
          {scientificName.map((name) => (
            <li key={name} className={styles.scientificList}>
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  root: 'dropdown dropdown-bottom dropdown-end',
  label: 'btn btn-link p-0',
  icon: 'h-5 w-5 fill-info',
  scientificList: 'list-disc ml-4',
  dropdownContent:
    'dropdown-content p-2 shadow bg-info rounded-lg text-xs w-36 capitalize',
};
