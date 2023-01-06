import { MAPBBOX_KEY } from '@config/internal';
import { LayerProps } from 'react-map-gl';

export type Layer = {
  [key in AnyLayerType]?: {
    [style: string]: any;
  };
};

// 'custom' type giving error on Layer component from react-map-gl
export type AnyLayerType = Exclude<LayerProps['type'], 'custom'>;

export interface Sources {
  [key: string]: Layer;
}

const LONGITUDE = Number(process.env.NEXT_PUBLIC_MAP_LONGITUDE ?? -123.111);
const LATITUDE = Number(process.env.NEXT_PUBLIC_MAP_LATITUDE ?? 49.288635);
const INITIAL_ZOOM = Number(process.env.NEXT_PUBLIC_MAP_INITIAL_ZOOM ?? 15.5);

export const layerMinZoom = 14.5;
export const layerMaxZoom = 17;
export const defaultZoom = 15.5;
export const zoomStep = 0.05;

export const mapConfig = {
  initialViewState: {
    longitude: LONGITUDE,
    latitude: LATITUDE,
    maxZoom: layerMaxZoom - 0.1,
    zoom: INITIAL_ZOOM,
  },
  mapStyle: 'mapbox://styles/mapbox/satellite-streets-v12',
  mapboxAccessToken: MAPBBOX_KEY,
  doubleClickZoom: false,
  dragRotate: false,
};

export const sources: Sources = {
  tiles: {
    fill: { color: '#F3F1F4', opacity: 0.6 },
    line: { width: 0.25, color: '#9FC7F4', opacity: 1 },
  },
  selectedTiles: {
    fill: { color: '#9FC7F4', opacity: 0.7 },
  },
};
