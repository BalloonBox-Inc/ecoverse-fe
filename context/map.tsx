import * as config from '@config/index';
import { Center } from '@services/map';
import { ChildrenProps } from '@utils/interface/global-interface';
import { createContext, useContext, useMemo } from 'react';
import { MapProvider as Provider, useMap } from 'react-map-gl';

interface MapContextValue {
  fly: (center: Center) => void;
}

const MapContext = createContext<MapContextValue | null>(null);

function _MapProvider({ children }: ChildrenProps) {
  return <Provider>{children}</Provider>;
}

export function useMapExtraMethods() {
  return useContext(MapContext);
}

export default function MapProvider({ children }: ChildrenProps) {
  const { current: map } = useMap();

  const mapMethods = useMemo(() => {
    return {
      fly: (center: Center) => {
        map?.flyTo({ center, zoom: config.defaultZoom });
      },
    };
  }, [map]);
  return (
    <_MapProvider>
      <MapContext.Provider value={mapMethods}>{children}</MapContext.Provider>
    </_MapProvider>
  );
}

/*
_MapProvider is used so that we can use the hook useMap on for the fly method context.
*/
