import ChevronRightIcon from '@components/Icons/ChevronRightIcon';
import LeafIcon from '@components/Icons/LeafIcon';
import LocationGoIcon from '@components/Icons/LocationGoIcon';
import LocationIcon from '@components/Icons/LocationIcon';
import * as config from '@config/index';
import { useMapExtraMethods } from '@context/map';
import { QueriedProject } from '@services/api/projects';
import { getCenterFromLngLat } from '@utils/map-utils';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Marker as _Marker, Popup, useMap } from 'react-map-gl';
import { twMerge } from 'tailwind-merge';

interface MarkerProps {
  project: QueriedProject;
}

export default function Marker({ project }: MarkerProps) {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const markerRef = useRef(null);

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
        anchor="bottom"
        onClick={handleMarkerClick}
      >
        <div
          ref={markerRef}
          className={twMerge(styles.root, !showMarker && styles.hideMarker)}
        >
          <LocationGoIcon className={styles.markerIconLocation} />
          <LeafIcon className={styles.markerIcon} />
        </div>
      </_Marker>

      {showPopup && (
        <Popup
          longitude={project.longitude!}
          latitude={project.latitude!}
          anchor="top"
          onClose={() => setShowPopup(false)}
          closeOnClick={false}
          focusAfterOpen={false}
        >
          <div className={styles.popupContent}>
            <div className={styles.popupHeaderContent}>
              <div className="flex">
                <button onClick={handleCenterMap}>
                  <LocationIcon className={styles.locationIcon} />
                </button>
                <h2 className={styles.popupHeader}>{project.province}</h2>
              </div>
              <p>
                {project.groupScheme}, {project.country}
              </p>
            </div>

            <p>Area: {project.effectiveArea} ha</p>
            <p>Product Group: {project.productGroup}</p>
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
  root: 'relative w-fit h-fit cursor-pointer',
  hideMarker: 'hidden',
  popupContent: 'p-1 w-fit text-xs font-figtree',
  popupHeaderContent: 'flex flex-col gap-1 justify-center mb-2',
  locationIcon: 'h-3 w-3 fill-current',
  popupHeader: 'uppercase text-base ml-1',
  markerIconLocation: 'h-10 w-10 fill-secondary',
  markerIcon:
    'h-4 w-4 fill-accent absolute top-2 left-1/2 -translate-x-1/2 bg-secondary',
  button: 'btn btn-xs btn-primary float-right flex gap-1 items-center mt-4',
  buttonIcon: 'h-2 w-2 fill-current',
};
