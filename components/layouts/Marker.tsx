import LeafIcon from '@components/Icons/LeafIcon';
import { QueriedProjectSummaryWithTiles } from '@services/api/projects';
import { Marker as _Marker } from 'react-map-gl';

interface MarkerProps {
  project: QueriedProjectSummaryWithTiles;
}

export default function Marker({ project }: MarkerProps) {
  return (
    <_Marker
      longitude={project.longitude}
      latitude={project.latitude}
      anchor="bottom"
    >
      <div className="bg-accent/50 backdrop-blur-lg p-2 rounded-full shadow-xl">
        <LeafIcon className="h-5 w-5 fill-secondary" />
      </div>
    </_Marker>
  );
}
