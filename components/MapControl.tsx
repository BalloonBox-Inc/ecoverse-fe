import * as config from '@config/index';
import { selectTiles, setTiles } from '@plugins/store/slices/map';
import { mapEventBus, ZOOM } from '@services/event-bus/map';
import { Center } from '@services/map';
import { TileObj, TilesObj } from '@utils/interface/map-interface';
import * as mapUtils from '@utils/map-utils';
import mapboxgl, {
  AnyLayer,
  GeoJSONSource,
  LngLat,
  Map,
  MapboxEvent,
  MapMouseEvent,
} from 'mapbox-gl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface Paint {
  [key: string]: any;
}

export default function MapControl() {
  const mapContainer = useRef(null);
  const [map, setMap] = useState<Map | null>(null);
  const dispatch = useDispatch();

  const tiles = useSelector(selectTiles);

  const getTileFromCoords = useCallback((coords: LngLat) => {
    const point = mapUtils.getMercatorCoordinateFromLngLat(coords);
    const tile =
      mapUtils.getMercatorCoordinateBoundsFromMercatorCoordinate(point);
    const id = mapUtils.getIdFromMercatorCoordinate(tile.nw);

    return id;
  }, []);

  const drawTiles = useCallback(
    (tiles: TileObj[], source: string) => {
      if (!map) return;

      const tilesData = mapUtils.getPolygonFromTiles(tiles);

      if (map.getStyle()) {
        const mapSource = map.getSource(source) as GeoJSONSource;
        mapSource.setData(tilesData);
      }
    },
    [map]
  );

  const mapRedraw = useCallback(() => {
    if (!map) return;
    const bounds = map.getBounds();
    const grid = mapUtils.getGridDataFromBounds(bounds);
    const gridSource = map.getSource('grid') as GeoJSONSource;
    gridSource.setData(grid);

    const computedTiles = mapUtils.getTilesFromBounds(bounds);
    drawTiles(computedTiles, 'tiles');

    const tilesObj: TilesObj = computedTiles.reduce(
      (obj: TilesObj, item: TileObj) => {
        obj[item.id] = item;
        return obj;
      },
      {}
    );

    dispatch(setTiles(tilesObj));
  }, [dispatch, drawTiles, map]);

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
            id: `${source}-${style}`,
            type: style as unknown as config.AnyLayerType,
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

  const onMapClick = useCallback(
    (e: MapMouseEvent) => {
      if (e.target.getZoom() < config.layerMinZoom) {
        return;
      }

      const coords = e.lngLat;
      const tile = getTileFromCoords(coords);
      console.log(tiles[tile]);
    },
    [tiles, getTileFromCoords]
  );

  const onMapLoad = useCallback(
    (e: MapboxEvent) => {
      initLayers(e.target);

      mapRedraw();
    },
    [mapRedraw, initLayers]
  );

  const onMapChange = useCallback(() => {
    mapRedraw();
  }, [mapRedraw]);

  useEffect(() => {
    const onCenterHandler = (center: Center) => {
      map?.flyTo({
        center,
        zoom: config.defaultZoom,
      });
    };

    const onMapZoom = (isZoomingIn: ZOOM) => {
      if (!map) return;
      if (isZoomingIn === ZOOM.DEFAULT) {
        map.setZoom(config.defaultZoom);
      }

      const currentZoom = map.getZoom();
      let zoom =
        currentZoom +
        (isZoomingIn === ZOOM.IN ? config.zoomStep : -config.zoomStep);

      const zoomToSet = isZoomingIn
        ? Math.min(config.layerMaxZoom, zoom)
        : Math.max(config.layerMinZoom, zoom);

      map.setZoom(zoomToSet);
    };

    mapEventBus.on('onCenter', onCenterHandler);
    mapEventBus.on('onZoomIn', onMapZoom);

    return () => {
      mapEventBus.off('onCenter', onCenterHandler);
      mapEventBus.on('onZoomIn', onMapZoom);
    };
  }, [map]);

  useEffect(() => {
    if (map) {
      map.on('load', onMapLoad);
      map.on('click', onMapClick);
      map.on('moveend', onMapChange);
      return () => {
        map.off('load', onMapLoad);
        map.off('click', onMapClick);
        map.off('moveend', onMapChange);
      };
    }
  }, [map, onMapChange, onMapClick, onMapLoad]);

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
