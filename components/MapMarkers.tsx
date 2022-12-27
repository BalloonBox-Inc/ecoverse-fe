import Marker from '@components/layouts/Marker';
import { QueriedProjectSummaryWithTiles } from '@services/api/projects';

interface MapMarkerProps {
  projects: QueriedProjectSummaryWithTiles[];
}

export default function MapMarkers({ projects }: MapMarkerProps) {
  return (
    <>
      {projects?.map((project: QueriedProjectSummaryWithTiles) => (
        <Marker key={project.farmId} project={project} />
      ))}
    </>
  );
}
