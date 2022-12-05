import { eventbus } from '@plugins/event-bus';

export const navEventBus = eventbus<{
  onShowSearch: (payload: boolean) => void;
}>();
