import * as config from '@config/index';
import mapboxgl, { Map } from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { useEffect, useRef, useState } from 'react';

mapboxgl.accessToken = config.MAPBBOX_KEY;

export default function MapControl() {
  const mapContainer = useRef(null);
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    if (map) return; // initialize map only once
    if (mapContainer.current) {
      setMap(
        new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/satellite-streets-v12',
          center: [-123.111, 49.288635],
          zoom: 15,
        })
      );
    }
  }, [mapContainer, map]);

  return <div ref={mapContainer} className={styles.mapContainer} />;
}

const styles = {
  mapContainer: 'h-screen w-screen',
};
