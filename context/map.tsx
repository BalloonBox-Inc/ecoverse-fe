import MapLayout from '@components/layouts/MapLayout';
import * as config from '@config/index';
import { Center } from '@services/map';
import { ChildrenProps } from '@utils/interface/global-interface';
import { createContext, useContext, useMemo } from 'react';
import { useMap } from 'react-map-gl';

interface MapContextValue {
  flyTo: (center: Center) => void;
}

const MapExtraMethodsContext = createContext<MapContextValue | null>(null);

export function useMapExtraMethods() {
  return useContext(MapExtraMethodsContext);
}

export default function MapExtraMethodsProvider({ children }: ChildrenProps) {
  const { mainMap } = useMap();

  const mapMethods = useMemo(() => {
    return {
      flyTo: (center: Center) => {
        mainMap?.flyTo({ center, zoom: config.defaultZoom });
      },
    };
  }, [mainMap]);

  return (
    <MapExtraMethodsContext.Provider value={mapMethods}>
      <MapLayout>{children}</MapLayout>
    </MapExtraMethodsContext.Provider>
  );
}

/*
_MapProvider is used so that we can use the hook useMap on for the fly method context.
*/
