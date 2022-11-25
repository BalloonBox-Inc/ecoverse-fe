import LocationIcon from '@components/Icons/LocationIcon';
import ZoomInIcon from '@components/Icons/ZoomInIcon';
import ZoomOutIcon from '@components/Icons/ZoomOutIcon';
import { mapEventBus, ZOOM } from '@services/event-bus/map';
import React, { useMemo } from 'react';

export default function MapZoomControl() {
  const buttons = useMemo(() => {
    return [
      {
        id: 'zoom-out',
        component: ZoomOutIcon,
        action: () => mapEventBus.emit('onZoomIn', ZOOM.OUT),
      },
      {
        id: 'center',
        component: LocationIcon,
        action: () => mapEventBus.emit('onZoomIn', ZOOM.DEFAULT),
      },
      {
        id: 'zoom-in',
        component: ZoomInIcon,
        action: () => mapEventBus.emit('onZoomIn', ZOOM.IN),
      },
    ];
  }, []);
  return (
    <div className="input-group absolute z-10 bottom-2 right-2 w-fit opacity-60 hover:opacity-100 transition-all">
      {buttons.map((button) => (
        <button
          key={button.id}
          onClick={button.action}
          className="btn btn-small backdrop-blur-xl no-animation py-2"
        >
          <button.component className="fill-current h-3" />
        </button>
      ))}
    </div>
  );
}
