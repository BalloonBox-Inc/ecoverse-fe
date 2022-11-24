import { eventbus } from '@plugins/event-bus';
import { Center } from '@services/map';

export const MapEventBus = eventbus<{
  onCenter: (payload: Center) => void;
}>();
