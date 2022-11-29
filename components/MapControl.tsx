import * as config from '@config/index';
import {
  finishSelecting,
  removeSelectedTile,
  selectIsSelecting,
  selectSelectedTiles,
  selectTiles,
  setSelectedTile,
  setTiles,
  startSelecting,
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
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface Paint {
  [key: string]: any;
}

export default function MapControl() {
  const mapContainer = useRef(null);
  const [map, setMap] = useState<Map | null>(null);
  const dispatch = useDispatch();

  const tiles = useSelector(selectTiles);
  const selectedTiles = useSelector(selectSelectedTiles);
  const isSelecting = useSelector(selectIsSelecting);

  const getTileFromCoords = (coords: LngLat) => {
    const point = mapUtils.getMercatorCoordinateFromLngLat(coords);
    const tile =
      mapUtils.getMercatorCoordinateBoundsFromMercatorCoordinate(point);
    const id = mapUtils.getIdFromMercatorCoordinate(tile.nw);

    return id;
  };

  const drawTiles = (tiles: TileObj[], source: string) => {
    if (!map) return;
    const tilesData = mapUtils.getPolygonFromTiles(tiles);
    if (map.getStyle()) {
      const mapSource = map.getSource(source) as GeoJSONSource;
      mapSource.setData(tilesData);
    }
  };

  const setAndDrawTiles = (bounds: LngLatBounds) => {
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
  };

  const mapRedraw = () => {
    if (!map) return;
    const bounds = map.getBounds();
    setAndDrawTiles(bounds);
  };

  const initLayers = (map: Map) => {
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
  };

  const onMapClick = (e: MapMouseEvent) => {
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
  };

  const onMapMove = (e: MapMouseEvent) => {
    if (!isSelecting) return;
    const coords = e.lngLat;
    // console.table({ ...coords, isSelecting });
    const tile = getTileFromCoords(coords);

    if (!tiles[tile]) return;

    dispatch(setSelectedTile(tiles[tile]));
  };

  const onMapLoad = (e: MapboxEvent) => {
    initLayers(e.target);

    mapRedraw();
  };

  const onMapChange = () => {
    mapRedraw();
  };

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
    map?.on('mousemove', onMapMove);
    map?.on('click', onMapClick);
    return () => {
      map?.off('mousemove', onMapMove);
      map?.off('click', onMapClick);
    };
  }, [map, isSelecting]);

  useEffect(() => {
    drawTiles(Object.values(selectedTiles), 'selectedTiles');
  }, [selectedTiles]);

  useEffect(() => {
    map?.on('load', onMapLoad);

    map?.on('moveend', onMapChange);
    return () => {
      map?.off('load', onMapLoad);
      map?.off('moveend', onMapChange);
    };
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
