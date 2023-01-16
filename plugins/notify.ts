import { Id, toast, ToastItem, TypeOptions } from 'react-toastify';

export type OnChangeCallbacks = {
  onOpen?: () => void;
  onUpdate?: () => void;
  onClose?: () => void;
};

export const notify = (
  message: string | undefined = 'Error',
  type: TypeOptions | 'dismiss' = 'default',
  callbacks: OnChangeCallbacks = {},
  isUpdate: boolean = false,
  toastId?: Id
) => {
  toast.onChange((payload: ToastItem) => {
    switch (payload.status) {
      case 'added':
        callbacks.onOpen?.();
        break;
      case 'updated':
        callbacks.onUpdate?.();
        break;
      case 'removed':
      default:
        callbacks.onClose?.();
    }
  });

  if (type === 'default') {
    return toast(message);
  }

  if (type === 'dismiss') {
    toastId ? toast.dismiss(toastId) : toast.dismiss();
    return undefined;
  }

  if (isUpdate && toastId === undefined) {
    return undefined;
  }

  if (isUpdate && toastId !== undefined) {
    toast.update(toastId, {
      render: message,
      type,
    });
    return toastId;
  }

  return toast[type](message);
};
