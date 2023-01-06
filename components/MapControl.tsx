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
    const map = mapRef.current;
    if (!map) return;

    const tilesData = mapUtils.getPolygonFromTiles(tiles);
    if (map.getStyle()) {
      const mapSource = map.getSource(source) as GeoJSONSource;
      mapSource.setData(tilesData);
    }
  }, []);

  const drawProjectsBoundary = useCallback((areas: TilesObj[]) => {
    const map = mapRef.current;
    if (!map) return;
    if (!map.getStyle()) return;

    const mapSource = map.getSource('projects') as GeoJSONSource;

    const features: GeoJSON.Feature<GeoJSON.Geometry>[] = [];

    areas.forEach((area) => {
      const polygon = mapUtils.getPolygonUnionFromTiles(Object.values(area));
      polygon && features.push(polygon);
    });

    mapSource.setData({ type: 'FeatureCollection', features });
  }, []);

  const updateTiles = useCallback(
    async (e: ViewStateChangeEvent) => {
      const map = e.target;

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

      drawTiles(Object.values(tilesObj), 'tiles');
      map.setFilter('tiles-fill', ['==', ['get', 'data'], null]);
      drawProjectsBoundary(Object.values(areas));

      dispatch(setArea(areas));
      dispatch(setTiles(tilesObj));
    },
    [dispatch, drawProjectsBoundary, drawTiles]
  );

  const updateMap = useCallback(
    (e: ViewStateChangeEvent) => {
      const map = e.target;
      if (map.getZoom() < config.layerMinZoom) return;

      updateTiles(e);
    },
    [updateTiles]
  );

  const onMapChange = useCallback(
    (e: ViewStateChangeEvent) => {
      updateMap(e);
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
      onMapChange(e as ViewStateChangeEvent);
    },
    [onMapChange]
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
