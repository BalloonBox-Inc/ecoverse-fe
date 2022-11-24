import * as config from '@config/index';
import { mapEventBus } from '@services/event-bus/map';
import { Center } from '@services/map';
import mapboxgl, { Map } from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { useCallback } from 'react';
import { useEffect, useRef, useState } from 'react';

export default function MapControl() {
  const mapContainer = useRef(null);
  const [map, setMap] = useState<Map | null>(null);

  const onCenterHandler = useCallback(
    (center: Center) => {
      map?.flyTo({
        center,
      });
    },
    [map]
  );

  useEffect(() => {
    mapEventBus.on('onCenter', onCenterHandler);

    return () => {
      mapEventBus.off('onCenter', onCenterHandler);
    };
  }, [onCenterHandler]);

  useEffect(() => {
    if (map) return; // initialize map only once
    if (mapContainer.current) {
      setMap(
        new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/satellite-streets-v12',
          center: [-123.111, 49.288635],
          zoom: 15,
          accessToken: config.MAPBBOX_KEY,
        })
      );
    }
  }, [mapContainer, map]);

  return <div ref={mapContainer} className={styles.mapContainer}></div>;
}

const styles = {
  mapContainer: 'h-screen w-screen',
};
