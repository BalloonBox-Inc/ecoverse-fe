import InfoIcon from '@components/Icons/InfoIcon';

interface Props {
  species: string;
  genus: string;
}

export default function FarmResourcesInfo({ species, genus }: Props) {
  return (
    <div className="dropdown dropdown-bottom dropdown-end">
      <label tabIndex={0} className="btn btn-link p-0">
        <InfoIcon className="h-5 w-5 fill-info" />
      </label>
      <div
        tabIndex={0}
        className="dropdown-content p-2 shadow bg-info rounded-lg text-xs w-36 capitalize"
      >
        <p>Species: {species}</p>
        <p>Genus: {genus}</p>
      </div>
    </div>
  );
}
