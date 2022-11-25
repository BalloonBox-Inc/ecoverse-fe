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

export const layerMinZoom = 11;
export const layerMaxZoom = 16;
export const defaultZoom = 13;
export const zoomStep = 0.05;

export const mapConfig: Partial<MapboxOptions> = {
  style: 'mapbox://styles/mapbox/satellite-streets-v12',
  center: [-123.111, 49.288635],
  maxZoom: layerMaxZoom,
  zoom: defaultZoom,
  accessToken: MAPBBOX_KEY,
  doubleClickZoom: false,
  dragRotate: false,
};

export const sources: Sources = {
  grid: {
    fill: { color: '#ea5460', opacity: 1, 'outline-color': '#ea5460' },
  },
};
