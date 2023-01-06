import Marker from '@components/layouts/Marker';
import * as config from '@config/index';
import {
  getProjectsByBounds,
  QueriedProjectSummary,
} from '@services/api/projects';
import { useCallback, useEffect, useState } from 'react';
import { useMap } from 'react-map-gl';

export default function MapMarkers() {
  const { mainMap } = useMap();
  const [projects, setProjects] = useState<QueriedProjectSummary[]>([]);

  const updateMarkers = useCallback(async () => {
    if (!mainMap) return;
    if (mainMap.getZoom() >= config.layerMinZoom) return;
    const bounds = mainMap.getBounds();
    const queriedProjects = await getProjectsByBounds(bounds);
    setProjects(queriedProjects as QueriedProjectSummary[]);
  }, [mainMap]);

  useEffect(() => {
    mainMap?.on('load', updateMarkers);
    mainMap?.on('moveend', updateMarkers);
  }, [mainMap, updateMarkers]);

  return (
    <>
      {projects?.map((project: QueriedProjectSummary) => (
        <Marker key={project.farmId} project={project} />
      ))}
    </>
  );
}
