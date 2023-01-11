import MapLayers from '@components/MapLayers';
import MapMarkers from '@components/MapMarkers';
import * as config from '@config/index';
import {
  finishRemoving,
  finishSelecting,
  removeSelectedTile,
  selectFillBatch,
  selectIsRemoving,
  selectIsSelecting,
  selectSelectedTiles,
  selectTiles,
  setArea,
  setSelectedTile,
  setTiles,
  startSelecting,
  stopFillBatch,
  stopSelecting,
} from '@plugins/store/slices/map';
import {
  getProjectsByBounds,
  QueriedProjectSummaryWithTiles,
} from '@services/api/projects';
import { notify, OnChangeCallbacks } from '@utils/helper';
import { TileAreaObj, TileObj, TilesObj } from '@utils/interface/map-interface';
import * as mapUtils from '@utils/map-utils';
import { useCallback, useEffect, useRef } from 'react';
import Map, {
  AttributionControl,
  GeoJSONSource,
  LngLat,
  LngLatBounds,
  MapboxEvent,
  MapLayerMouseEvent,
  MapRef,
  NavigationControl,
  ViewStateChangeEvent,
} from 'react-map-gl';
import { useDispatch, useSelector } from 'react-redux';
import { Id } from 'react-toastify';

export default function MapControl() {
  const dispatch = useDispatch();
  const mapRef = useRef<MapRef>(null);
  const error = useRef<string>('');
  const notifyId = useRef<Id | undefined>(undefined);

  const tiles = useSelector(selectTiles);
  const selectedTiles = useSelector(selectSelectedTiles);
  const isSelecting = useSelector(selectIsSelecting);
  const isRemoving = useSelector(selectIsRemoving);
  const fillBatch = useSelector(selectFillBatch);

  const addLabelLayer = useCallback((map: mapboxgl.Map) => {
    map.addSource('labels', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });

    map.addLayer({
      id: 'project-labels',
      type: 'symbol',
      source: 'labels',
      minzoom: config.layerMinZoom,
      maxzoom: config.layerMaxZoom,
      layout: {
        'text-field': ['get', 'description'],
        'text-variable-anchor': ['center'],
        'text-radial-offset': 0.5,
        'text-justify': 'auto',
        'text-transform': 'uppercase',
        'text-font': ['DIN Pro Bold'],
      },
      paint: {
        'text-color': '#F3F1F4',
      },
    });
  }, []);

  const setNotifyError = useCallback((newError: string) => {
    const onChangeCallbacks: OnChangeCallbacks = {
      onOpen: () => (error.current = newError),
      onUpdate: () => (error.current = newError),
      onClose: () => (error.current = ''),
    };

    if (!error.current) {
      notifyId.current = notify(newError, 'error', onChangeCallbacks);
      return;
    }

    notifyId.current = notify(
      newError,
      'error',
      onChangeCallbacks,
      true,
      notifyId.current
    );
  }, []);

  const clearNotifyError = useCallback(() => {
    if (notifyId.current) {
      notifyId.current = notify(undefined, 'dismiss');
    }
  }, []);

  const getTileFromCoords = useCallback((coords: LngLat) => {
    const point = mapUtils.getMercatorCoordinateFromLngLat(coords);
    const tile =
      mapUtils.getMercatorCoordinateBoundsFromMercatorCoordinate(point);
    const id = mapUtils.getIdFromMercatorCoordinate(tile.nw);

    return id;
  }, []);

  const drawTiles = useCallback((tiles: TileObj[], source: string) => {
    if (mapRef.current?.getStyle()) {
      const tilesData = mapUtils.getPolygonFromTiles(tiles);
      const mapSource = mapRef.current.getSource(source) as GeoJSONSource;
      mapSource.setData(tilesData);
    }
  }, []);

  const drawProjectsBoundary = useCallback(
    (projects: QueriedProjectSummaryWithTiles[]) => {
      if (!mapRef.current?.getStyle()) return;

      const mapSourceBoundary = mapRef.current.getSource(
        'projects'
      ) as GeoJSONSource;

      const mapSourceLabels = mapRef.current.getSource(
        'labels'
      ) as GeoJSONSource;

      projects.forEach((project) => {
        const feature: GeoJSON.Feature<GeoJSON.Geometry> = {
          type: 'Feature',
          geometry: JSON.parse(project.data.polygon!),
          properties: {
            description: `${project.data.province}, ${project.data.groupScheme}`,
          },
        };

        mapSourceBoundary.setData(feature);
        mapSourceLabels.setData(feature);
      });
    },
    []
  );

  const drawGrid = useCallback((bounds: LngLatBounds) => {
    const map = mapRef.current;
    if (!map?.getStyle()) return;
    const gridData = mapUtils.getGridDataFromBounds(bounds);
    const mapSource = map.getSource('grid') as GeoJSONSource;
    mapSource.setData(gridData);
  }, []);

  const updateTiles = useCallback(
    async (map: mapboxgl.Map) => {
      const bounds = map.getBounds();
      const computedTiles = mapUtils.getTilesFromBounds(bounds);
      const tilesObj: TilesObj = computedTiles.reduce(
        (obj: TilesObj, item: TileObj) => {
          obj[item.id] = item;
          return obj;
        },
        {}
      );

      const projects = (await getProjectsByBounds(
        map.getBounds(),
        false
      )) as QueriedProjectSummaryWithTiles[];

      const areas: TileAreaObj = {};

      projects.forEach((project) => {
        const projectTiles: TilesObj = {};
        project.tiles.forEach((tile) => {
          const tileValue = Number(tile);
          if (tilesObj[tileValue]) {
            tilesObj[tileValue] = {
              ...tilesObj[tileValue],
              data: project.data,
            };
            projectTiles[tileValue] = tilesObj[tileValue];
          }
        });
        areas[Number(project.data.farmId)] = projectTiles;
      });

      // drawTiles(Object.values(tilesObj), 'tiles');
      // map.setFilter('tiles-fill', ['==', ['get', 'data'], null]);
      drawGrid(bounds);
      drawProjectsBoundary(projects);

      dispatch(setArea(areas));
      dispatch(setTiles(tilesObj));
    },
    [dispatch, drawGrid, drawProjectsBoundary]
  );

  const updateMap = useCallback(
    (map: mapboxgl.Map) => {
      if (map.getZoom() < config.layerMinZoom) return;

      updateTiles(map);
    },
    [updateTiles]
  );

  const onMapChange = useCallback(
    (e: ViewStateChangeEvent) => {
      updateMap(e.target);
    },
    [updateMap]
  );

  const onMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const map = e.target;
      if (map.getZoom() < config.layerMinZoom) {
        return;
      }

      const coords = e.lngLat;
      const tile = getTileFromCoords(coords);

      if (!tiles[tile]) {
        setNotifyError('Invalid tile selected!');
        return;
      }

      if (!tiles[tile].data) {
        setNotifyError('This tile is disabled!');
        return;
      }

      const selectedTilesList = Object.values(selectedTiles);
      if (
        selectedTilesList.length &&
        selectedTilesList[0].data.farmId !== tiles[tile].data.farmId
      ) {
        setNotifyError(
          'Unable to select tiles outside of the previously selected farm!'
        );
        return;
      }

      if (isSelecting) {
        dispatch(finishSelecting(tiles[tile]));
        return;
      }

      if (selectedTiles[tile]) {
        dispatch(removeSelectedTile(selectedTiles[tile]));
        return;
      }

      clearNotifyError();
      dispatch(startSelecting(tiles[tile]));
    },
    [
      clearNotifyError,
      dispatch,
      getTileFromCoords,
      isSelecting,
      selectedTiles,
      setNotifyError,
      tiles,
    ]
  );

  const onMouseMove = useCallback(
    (e: MapLayerMouseEvent) => {
      const map = e.target;
      if (map.getZoom() < config.layerMinZoom) return;
      if (!isSelecting) return;
      const coords = e.lngLat;

      const tile = getTileFromCoords(coords);

      if (!tiles[tile]) {
        dispatch(stopSelecting());
        setNotifyError('Invalid tile selected!');
        return;
      }

      if (!tiles[tile].data) {
        dispatch(stopSelecting());
        setNotifyError('This tile is disabled!');
        return;
      }

      dispatch(setSelectedTile(tiles[tile]));
    },
    [dispatch, getTileFromCoords, isSelecting, setNotifyError, tiles]
  );

  const onMapMouseLeave = useCallback(
    (e: MapLayerMouseEvent) => {
      const map = e.target;
      if (map.getZoom() < config.layerMinZoom) return;

      dispatch(stopSelecting());
    },
    [dispatch]
  );

  const onMapLoad = useCallback(
    (e: MapboxEvent) => {
      addLabelLayer(e.target);
      onMapChange(e as ViewStateChangeEvent);
    },
    [onMapChange, addLabelLayer]
  );

  useEffect(() => {
    if (isSelecting || isRemoving || fillBatch) {
      drawTiles(Object.values(selectedTiles), 'selectedTiles');
    }

    if (isRemoving) dispatch(finishRemoving());
    if (fillBatch) dispatch(stopFillBatch());
  }, [dispatch, drawTiles, isRemoving, isSelecting, selectedTiles, fillBatch]);

  useEffect(() => {
    if (!isSelecting) return;

    const keyPressHandlers = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch(stopSelecting());
      }
    };

    window.addEventListener('keyup', keyPressHandlers);

    return () => {
      window.addEventListener('keyup', keyPressHandlers);
    };
  }, [dispatch, isSelecting]);

  return (
    <Map
      {...config.mapConfig}
      id="mainMap"
      ref={mapRef}
      onLoad={onMapLoad}
      onMoveEnd={onMapChange}
      onClick={onMapClick}
      onMouseMove={onMouseMove}
      onMouseOut={onMapMouseLeave}
      attributionControl={false}
    >
      <MapLayers />
      <MapMarkers />
      <AttributionControl
        customAttribution={['Ecoverse', 'BalloonBox']}
        position="bottom-right"
      />
      <NavigationControl position="bottom-right" showCompass={false} />
    </Map>
  );
}
