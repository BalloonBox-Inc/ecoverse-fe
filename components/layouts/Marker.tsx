import ChevronRightIcon from '@components/Icons/ChevronRightIcon';
import LeafIcon from '@components/Icons/LeafIcon';
import LocationGoIcon from '@components/Icons/LocationGoIcon';
import LocationIcon from '@components/Icons/LocationIcon';
import * as config from '@config/index';
import { useMapExtraMethods } from '@context/map';
import { QueriedProjectSummaryWithTiles } from '@services/api/projects';
import { getCenterFromLngLat } from '@utils/map-utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Marker as _Marker, Popup, useMap } from 'react-map-gl';
import { twMerge } from 'tailwind-merge';

interface MarkerProps {
  project: QueriedProjectSummaryWithTiles;
}

export default function Marker({ project }: MarkerProps) {
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const { mainMap } = useMap();
  const router = useRouter();
  const mapExtraMethods = useMapExtraMethods();

  const showMarker =
    (mainMap?.getZoom() ?? Number.POSITIVE_INFINITY) < config.layerMinZoom;

  const handleMarkerClick = () => {
    if (!showMarker) return;
    setShowPopup(true);
  };

  const handleGoToDetails = () => {
    router.push(`/projects/${project.farmId}`);
  };

  const handleCenterMap = () => {
    const mapboxCenter = getCenterFromLngLat(
      Number(project.longitude),
      Number(project.latitude)
    );
    mapExtraMethods?.flyTo(mapboxCenter);
  };

  useEffect(() => {
    if (!mainMap) return;

    if (!showMarker) setShowPopup(false);
  }, [mainMap, showMarker]);

  return (
    <>
      <_Marker
        longitude={project.longitude}
        latitude={project.latitude}
        anchor="top"
        onClick={handleMarkerClick}
      >
        <div className={twMerge(styles.root, !showMarker && styles.hideMarker)}>
          <LocationGoIcon className={styles.markerIconLocation} />
          <LeafIcon className={styles.markerIcon} />
        </div>
      </_Marker>
      {showPopup && (
        <Popup
          longitude={project.longitude!}
          latitude={project.latitude!}
          anchor="bottom"
          onClose={() => setShowPopup(false)}
          closeOnClick={false}
          focusAfterOpen={false}
        >
          <div className={styles.popupContent}>
            <div className={styles.popupHeaderContent}>
              <button onClick={handleCenterMap}>
                <LocationIcon className={styles.locationIcon} />
              </button>
              <h2 className={styles.popupHeader}>{project.province}</h2>
            </div>
            <p>
              {project.groupScheme}, {project.country}
            </p>
            <p>{project.productGroup}</p>
            <button className={styles.button} onClick={handleGoToDetails}>
              See Details
              <ChevronRightIcon className={styles.buttonIcon} />
            </button>
          </div>
        </Popup>
      )}
    </>
  );
}

const styles = {
  root: 'relative w-fit h-fit cursor-pointer opacity-100 transition-all',
  hideMarker: 'opacity-0 hidden',
  popupContent: 'p-1 w-fit text-xs',
  popupHeaderContent: 'flex gap-1 items-center mb-2',
  locationIcon: 'h-3 w-3 fill-current',
  popupHeader: 'uppercase text-base',
  markerIconLocation: 'h-10 w-10 fill-secondary',
  markerIcon:
    'h-4 w-4 fill-accent absolute top-2 left-1/2 -translate-x-1/2 bg-secondary',
  button: 'btn btn-xs btn-ghost float-right flex gap-1 items-center mt-4',
  buttonIcon: 'h-2 w-2 fill-current',
};
