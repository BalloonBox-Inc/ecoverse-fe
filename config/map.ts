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

export const layerMinZoom = 14.5;
export const layerMaxZoom = 17;
export const defaultZoom = 15.5;
export const zoomStep = 0.05;

export const mapConfig = {
  initialViewState: {
    longitude: -123.111,
    latitude: 49.288635,
    maxZoom: layerMaxZoom - 0.1,
    zoom: defaultZoom,
  },
  mapStyle: 'mapbox://styles/mapbox/satellite-streets-v12',
  mapboxAccessToken: MAPBBOX_KEY,
  doubleClickZoom: false,
  dragRotate: false,
};

export const sources: Sources = {
  tiles: {
    fill: { color: '#828282', opacity: 0.2 },
    line: { width: 1, color: '#ea5460', opacity: 1 },
  },
  selectedTiles: {
    fill: { color: '#9FC7F4', opacity: 0.7 },
  },
};
