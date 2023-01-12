import { Id, toast, ToastItem, TypeOptions } from 'react-toastify';

export const snakeToCamel = (str: string): string =>
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace('-', '').replace('_', '')
    );

export const properCase = (str: string): string => {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
};

export const urlify = (str: string): string => {
  return str.replace(/ /g, '%20');
};

export const numFormat = (num: number) => {
  return Number(num.toFixed(2)).toLocaleString('en-US');
};

export const m2ToHaFormat = (num: number) => {
  const converted = num / 10000;
  return numFormat(converted);
};

export const getBasePathName = (pathName: string) => {
  return pathName.match(/(?<=\/)\w+/g)?.[0] ?? '';
};

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
