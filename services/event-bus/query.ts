import { eventbus } from '@plugins/event-bus';

export const queryEventBus = eventbus<{
  clearQuery: (payload: void) => void;
}>();
