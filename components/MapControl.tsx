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
import { useQuery } from '@tanstack/react-query';
import { TileObj, TilesObj } from '@utils/interface/map-interface';
import * as mapUtils from '@utils/map-utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import Map, {
  AttributionControl,
  GeoJSONSource,
  LngLat,
  LngLatBounds,
  MapLayerMouseEvent,
  MapRef,
  NavigationControl,
} from 'react-map-gl';
import { useDispatch, useSelector } from 'react-redux';

export default function MapControl() {
  const dispatch = useDispatch();
  const mapRef = useRef<MapRef>(null);
  const [bounds, setBounds] = useState<LngLatBounds | null>(null);
  const [projects, setProjects] = useState<QueriedProjectSummaryWithTiles[]>(
    []
  );

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

  useQuery({
    queryKey: ['mapBounds', bounds],
    queryFn: () => getProjectsByBounds(bounds),
    initialData: projects,
    onSuccess(data: QueriedProjectSummaryWithTiles[]) {
      setProjects(data);
    },
  });

  const drawTiles = useCallback((tiles: TileObj[], source: string) => {
    const map = mapRef.current;
    if (!map) return;

    const tilesData = mapUtils.getPolygonFromTiles(tiles);
    if (map.getStyle()) {
      const mapSource = map.getSource(source) as GeoJSONSource;
      mapSource.setData(tilesData);
    }
  }, []);

  const updateMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    setBounds(map.getBounds());
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

    updateMarkers();

    if (map.getZoom() < config.layerMinZoom) return;

    updateTiles();
  }, [updateMarkers, updateTiles]);

  const onMapLoad = useCallback(() => {
    updateMap();
  }, [updateMap]);

  const onMapChange = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

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
    const map = mapRef.current;
    if (!map) return;
    if (map.getZoom() < config.layerMinZoom) return;

    dispatch(stopSelecting());
  }, [dispatch]);

  useEffect(() => {
    if (isSelecting || isRemoving || fillBatch) {
      drawTiles(Object.values(selectedTiles), 'selectedTiles');
    }

    if (isRemoving) dispatch(finishRemoving());
    if (fillBatch) dispatch(stopFillBatch());
  }, [dispatch, drawTiles, isRemoving, isSelecting, selectedTiles, fillBatch]);

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
      <MapMarkers projects={projects} />
      <AttributionControl
        customAttribution={['Ecoverse', 'BalloonBox']}
        position="bottom-right"
      />
      <NavigationControl position="bottom-right" showCompass={false} />
    </Map>
  );
}
