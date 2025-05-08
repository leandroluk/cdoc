import {create} from 'zustand';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export type ToastItem = {
  title: string;
  description?: string;
  type?: ToastType;
  icon?: React.ReactNode;
  duration?: number;
  soft?: boolean;
};

type Store = Store.State & Store.Actions;
namespace Store {
  export type State = {
    toasts: Array<ToastItem & {id: string}>;
  };
  export type Actions = {
    show: (toast: ToastItem) => void;
    info: (toast: Omit<ToastItem, 'type'>) => void;
    success: (toast: Omit<ToastItem, 'type'>) => void;
    warning: (toast: Omit<ToastItem, 'type'>) => void;
    error: (toast: Omit<ToastItem, 'type'>) => void;
    remove: (id: string) => void;
  };
}

const useToastStore = create<Store>((set, get) => ({
  toasts: [],
  show: ({title, description, type = 'info', icon, duration = 4000}) => {
    const id = crypto.randomUUID();
    const toast = {id, title, description, type, icon, duration};
    set(state => ({toasts: [...state.toasts, toast]}));
    setTimeout(() => get().remove(id), duration);
  },
  info: toast => get().show({...toast, type: 'info'}),
  success: toast => get().show({...toast, type: 'success'}),
  warning: toast => get().show({...toast, type: 'warning'}),
  error: toast => get().show({...toast, type: 'error'}),
  remove: id => set(state => ({toasts: state.toasts.filter(t => t.id !== id)})),
}));

export default useToastStore;
