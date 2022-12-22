import * as config from '@config/index';
import { Sources as SourcesInterface, sources } from '@config/map';
import { Layer, Source } from 'react-map-gl';

interface Paint {
  [key: string]: any;
}

type Styles = Style[];
type Style = [config.AnyLayerType, { [style: string]: any }];
interface LayersProps {
  styles: Styles;
  source: Extract<keyof SourcesInterface, string>;
}

export default function MapLayers() {
  return (
    <>
      {Object.entries(sources).map(([source, styles]) => (
        <Source
          key={source}
          id={source}
          type="geojson"
          data={{
            type: 'FeatureCollection',
            features: [],
          }}
        >
          <Layers styles={Object.entries(styles) as Styles} source={source} />
        </Source>
      ))}
    </>
  );
}

const Layers = ({ styles, source }: LayersProps) => {
  return (
    <>
      {styles.map(([style, attributes]: Styles[0]) => {
        const paint = Object.entries(attributes).reduce(
          (acc: Paint, [name, value]) => {
            acc[`${style}-${name}`] = value;
            return acc;
          },
          {}
        );

        return (
          <Layer
            key={`${source}-${style}`}
            id={`${source}-${style}`}
            type={style}
            source={source}
            paint={paint}
            maxzoom={config.layerMaxZoom}
            minzoom={config.layerMinZoom}
          />
        );
      })}
    </>
  );
};
