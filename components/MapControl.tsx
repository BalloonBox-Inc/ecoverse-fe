import * as config from '@config/index';
import {
  finishRemoving,
  finishSelecting,
  removeSelectedTile,
  selectIsRemoving,
  selectIsSelecting,
  selectSelectedTiles,
  selectTiles,
  setSelectedTile,
  setTiles,
  startSelecting,
  stopSelecting,
} from '@plugins/store/slices/map';
import { mapEventBus, ZOOM } from '@services/event-bus/map';
import { Center } from '@services/map';
import { TileObj, TilesObj } from '@utils/interface/map-interface';
import * as mapUtils from '@utils/map-utils';
import mapboxgl, {
  AnyLayer,
  GeoJSONSource,
  LngLat,
  LngLatBounds,
  Map,
  MapboxEvent,
  MapMouseEvent,
} from 'mapbox-gl';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface Paint {
  [key: string]: any;
}

export default function MapControl() {
  const mapContainer = useRef(null);
  const [map, setMap] = useState<Map | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const tiles = useSelector(selectTiles);
  const selectedTiles = useSelector(selectSelectedTiles);
  const isSelecting = useSelector(selectIsSelecting);
  const isRemoving = useSelector(selectIsRemoving);

  const getTileFromCoords = (coords: LngLat) => {
    const point = mapUtils.getMercatorCoordinateFromLngLat(coords);
    const tile =
      mapUtils.getMercatorCoordinateBoundsFromMercatorCoordinate(point);
    const id = mapUtils.getIdFromMercatorCoordinate(tile.nw);

    return id;
  };

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

  const setAndDrawTiles = useCallback(
    (bounds: LngLatBounds) => {
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
    },
    [dispatch, drawTiles]
  );

  const mapRedraw = useCallback(() => {
    if (!map) return;
    if (map.isMoving()) return;
    const bounds = map.getBounds();
    setAndDrawTiles(bounds);
  }, [map, setAndDrawTiles]);

  const initLayers = useCallback(() => {
    if (!map) return;
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
  }, [map]);

  const onMapClick = useCallback(
    (e: MapMouseEvent) => {
      if (e.target.getZoom() < config.layerMinZoom) {
        return;
      }

      const coords = e.lngLat;
      const tile = getTileFromCoords(coords);

      if (!tiles[tile]) return;

      if (isSelecting) {
        dispatch(finishSelecting(tiles[tile]));
        return;
      }

      if (selectedTiles[tile]) {
        dispatch(removeSelectedTile(selectedTiles[tile]));
        return;
      }

      dispatch(startSelecting(tiles[tile]));
    },
    [dispatch, isSelecting, selectedTiles, tiles]
  );

  const onMapMove = useCallback(
    (e: MapMouseEvent) => {
      if (e.target.getZoom() < config.layerMinZoom) {
        return;
      }
      if (!isSelecting) return;
      const coords = e.lngLat;
      const tile = getTileFromCoords(coords);

      if (!tiles[tile]) return;

      dispatch(setSelectedTile(tiles[tile]));
    },
    [dispatch, isSelecting, tiles]
  );

  const onMapMouseLeave = useCallback(() => {
    dispatch(stopSelecting());
  }, [dispatch]);

  const onMapLoad = useCallback(() => {
    initLayers();
    mapRedraw();
  }, [initLayers, mapRedraw]);

  const onMapChange = useCallback(
    (e: MapboxEvent) => {
      if (e.target.getZoom() < config.layerMinZoom) {
        return;
      }
      mapRedraw();
    },
    [mapRedraw]
  );

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

    const center = router.query;
    if ('lng' in center && 'lat' in center) {
      const mapboxCenter = new mapboxgl.LngLat(
        Number(center.lng),
        Number(center.lat)
      );
      onCenterHandler(mapboxCenter);
    }

    return () => {
      mapEventBus.off('onCenter', onCenterHandler);
      mapEventBus.on('onZoomIn', onMapZoom);
    };
  }, [map, router.query]);

  useEffect(() => {
    map?.on('mousemove', onMapMove);
    map?.on('click', onMapClick);
    map?.on('mouseout', onMapMouseLeave);
    return () => {
      map?.off('mousemove', onMapMove);
      map?.off('click', onMapClick);
      map?.off('mouseout', onMapMouseLeave);
    };
  }, [map, isSelecting, onMapMove, onMapClick, onMapMouseLeave]);

  useEffect(() => {
    if (isSelecting || isRemoving) {
      drawTiles(Object.values(selectedTiles), 'selectedTiles');
      dispatch(finishRemoving());
    }
  }, [dispatch, drawTiles, isRemoving, isSelecting, selectedTiles]);

  useEffect(() => {
    map?.on('load', onMapLoad);

    map?.on('moveend', onMapChange);
    return () => {
      map?.off('load', onMapLoad);
      map?.off('moveend', onMapChange);
    };
  }, [map, onMapChange, onMapLoad]);

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
