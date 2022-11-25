import * as config from '@config/index';
import { AnyLayerType } from '@config/index';
import { mapEventBus } from '@services/event-bus/map';
import { Center } from '@services/map';
import { getGridDataFromBounds } from '@utils/map-utils';
import mapboxgl, {
  AnyLayer,
  GeoJSONSource,
  Map,
  MapboxEvent,
  MapMouseEvent,
} from 'mapbox-gl';
import { useCallback } from 'react';
import { useEffect, useRef, useState } from 'react';

interface Paint {
  [key: string]: any;
}

export default function MapControl() {
  const mapContainer = useRef(null);
  const [map, setMap] = useState<Map | null>(null);

  const onCenterHandler = useCallback(
    (center: Center) => {
      map?.flyTo({
        center,
        zoom: config.defaultZoom,
      });
    },
    [map]
  );

  const onMapClick = useCallback(
    (e: MapMouseEvent) => {
      console.log(e.lngLat);
    },
    [map]
  );

  const onMapLoad = useCallback(
    (e: MapboxEvent) => {
      initLayers(e.target);

      onMapChange(e);
    },
    [map]
  );

  const onMapChange = useCallback(
    (e: MapboxEvent) => {
      mapRedraw(e.target);
    },
    [map]
  );

  const initLayers = useCallback((map: Map) => {
    Object.entries(config.sources).forEach(([source, styles]) => {
      if (!map.getSource(source)) {
        map.addSource(source, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });
      }

      if (!map.getLayer(source)) {
        Object.entries(styles).forEach(([style, attributes]) => {
          const paint = Object.entries(attributes).reduce(
            (acc: Paint, [name, value]) => {
              acc[`${style}-${name}`] = value;
              return acc;
            },
            {}
          );

          const layer = {
            id: source,
            type: style as unknown as AnyLayerType,
            source,
            minzoom: config.layerMinZoom,
            maxzoom: config.layerMaxZoom,
            paint,
          };
          map.addLayer(layer as AnyLayer);
        });
      }
    });
  }, []);

  const mapRedraw = useCallback((mapTarget: Map) => {
    const bounds = mapTarget.getBounds();
    const grid = getGridDataFromBounds(bounds);
    const gridSource = mapTarget.getSource('grid') as GeoJSONSource;
    gridSource.setData(grid);
  }, []);

  useEffect(() => {
    mapEventBus.on('onCenter', onCenterHandler);

    return () => {
      mapEventBus.off('onCenter', onCenterHandler);
    };
  }, [onCenterHandler]);

  useEffect(() => {
    if (map) {
      map.on('load', onMapLoad);
      map.on('click', onMapClick);
      map.on('moveend', onMapChange);
      return () => {
        map.off('click', onMapClick);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  useEffect(() => {
    if (map) return; // initialize map only once
    if (mapContainer.current) {
      setMap(
        new mapboxgl.Map({
          container: mapContainer.current,
          ...config.mapConfig,
        })
      );
    }
  }, [mapContainer, map]);

  return <div ref={mapContainer} className={styles.mapContainer}></div>;
}

const styles = {
  mapContainer: 'h-screen w-screen',
};
