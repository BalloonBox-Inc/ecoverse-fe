import { MAPBBOX_KEY } from '@config/internal';
import { MapboxOptions } from 'mapbox-gl';

interface Sources {
  [key: string]: Layer;
}

type Layer = {
  [key in AnyLayerType]?: {
    [style: string]: any;
  };
};

export type AnyLayerType =
  | 'symbol'
  | 'fill'
  | 'circle'
  | 'line'
  | 'raster'
  | 'custom'
  | 'background'
  | 'fill-extrusion'
  | 'heatmap'
  | 'hillshade'
  | 'sky';

export const layerMinZoom = 14.5;
export const layerMaxZoom = 17;
export const defaultZoom = 15;
export const zoomStep = 0.05;

export const mapConfig: Partial<MapboxOptions> = {
  style: 'mapbox://styles/mapbox/satellite-streets-v12',
  center: [-123.111, 49.288635],
  minZoom: layerMinZoom - 0.5,
  maxZoom: layerMaxZoom - 0.1,
  zoom: defaultZoom,
  accessToken: MAPBBOX_KEY,
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
