import { eventbus } from '@plugins/event-bus';
import { Center } from '@services/map';

export const mapEventBus = eventbus<{
  onCenter: (payload: Center) => void;
}>();
