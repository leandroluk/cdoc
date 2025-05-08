import ToastWrapper from './ToastWrapper';
import useToastStore, {type ToastItem} from './useToastStore';

namespace Toast {
  export type Item = ToastItem;
}

const Toast = Object.assign(ToastWrapper, {
  Wrapper: ToastWrapper,
  useStore: useToastStore,
  error: useToastStore.getState().error,
  info: useToastStore.getState().info,
  remove: useToastStore.getState().remove,
  show: useToastStore.getState().show,
  success: useToastStore.getState().success,
  warning: useToastStore.getState().warning,
});

export default Toast;
