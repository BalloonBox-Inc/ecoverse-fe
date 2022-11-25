import { eventbus } from '@plugins/event-bus';
import { Center } from '@services/map';

export enum ZOOM {
  IN,
  DEFAULT,
  OUT,
}

export const mapEventBus = eventbus<{
  onCenter: (payload: Center) => void;
  onZoomIn: (payload: ZOOM) => void;
}>();
