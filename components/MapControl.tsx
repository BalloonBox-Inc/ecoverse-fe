import MapLayers from '@components/MapLayers';
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
import { TileObj, TilesObj } from '@utils/interface/map-interface';
import * as mapUtils from '@utils/map-utils';
import { useCallback, useEffect, useRef } from 'react';
import Map, {
  GeoJSONSource,
  LngLat,
  MapLayerMouseEvent,
  MapRef,
  NavigationControl,
} from 'react-map-gl';
import { useDispatch, useSelector } from 'react-redux';

export default function MapControl() {
  const dispatch = useDispatch();
  const mapRef = useRef<MapRef>(null);

  const tiles = useSelector(selectTiles);
  const selectedTiles = useSelector(selectSelectedTiles);
  const isSelecting = useSelector(selectIsSelecting);
  const isRemoving = useSelector(selectIsRemoving);

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

  const updateTiles = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    const bounds = map.getBounds();
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
  }, [dispatch, drawTiles]);

  const updateMap = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    updateTiles();
  }, [updateTiles]);

  const onMapLoad = useCallback(() => {
    updateMap();
  }, [updateMap]);

  const onMapChange = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    if (map.getZoom() < config.layerMinZoom) return;
    updateMap();
  }, [updateMap]);

  const onMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const map = mapRef.current;
      if (!map) return;
      if (map.getZoom() < config.layerMinZoom) {
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
    [dispatch, getTileFromCoords, isSelecting, selectedTiles, tiles]
  );

  const onMouseMove = useCallback(
    (e: MapLayerMouseEvent) => {
      const map = mapRef.current;
      if (!map) return;
      if (map.getZoom() < config.layerMinZoom) return;
      if (!isSelecting) return;
      const coords = e.lngLat;

      const tile = getTileFromCoords(coords);

      if (!tiles[tile]) return;

      dispatch(setSelectedTile(tiles[tile]));
    },
    [dispatch, getTileFromCoords, isSelecting, tiles]
  );

  const onMapMouseLeave = useCallback(() => {
    dispatch(stopSelecting());
  }, [dispatch]);

  useEffect(() => {
    if (isSelecting || isRemoving) {
      drawTiles(Object.values(selectedTiles), 'selectedTiles');
      dispatch(finishRemoving());
    }
  }, [dispatch, drawTiles, isRemoving, isSelecting, selectedTiles]);

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
    >
      <MapLayers />
      <NavigationControl position="bottom-right" showCompass={false} />
    </Map>
  );
}
// todo: markers for project
