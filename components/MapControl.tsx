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
import { TileObj, TilesObj } from '@utils/interface/map-interface';
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

export default function MapControl() {
  const dispatch = useDispatch();
  const mapRef = useRef<MapRef>(null);

  const tiles = useSelector(selectTiles);
  const selectedTiles = useSelector(selectSelectedTiles);
  const isSelecting = useSelector(selectIsSelecting);
  const isRemoving = useSelector(selectIsRemoving);
  const fillBatch = useSelector(selectFillBatch);

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

      projects.forEach((project) => {
        project.tiles.forEach((tile) => {
          if (tilesObj[Number(tile)]) {
            tilesObj[Number(tile)] = {
              ...tilesObj[Number(tile)],
              data: project.data,
            };
          }
        });
      });

      dispatch(setTiles(tilesObj));

      drawTiles(Object.values(tilesObj), 'tiles');
      map.setFilter('tiles-fill', ['==', ['get', 'data'], null]);
    },
    [dispatch, drawTiles]
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

      if (!tiles[tile]) return;

      if (!tiles[tile].data) return;

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
    [dispatch, getTileFromCoords, isSelecting, selectedTiles, tiles]
  );

  const onMouseMove = useCallback(
    (e: MapLayerMouseEvent) => {
      const map = e.target;
      if (map.getZoom() < config.layerMinZoom) return;
      if (!isSelecting) return;
      const coords = e.lngLat;

      const tile = getTileFromCoords(coords);

      if (!tiles[tile]) return;

      if (!tiles[tile].data) {
        return;
      }

      dispatch(setSelectedTile(tiles[tile]));
    },
    [dispatch, getTileFromCoords, isSelecting, tiles]
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
