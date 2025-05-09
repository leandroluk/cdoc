import toastProps from './toastProps';
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
  /**
   * Default toast props based on http status code
   */
  toastProps,
});

export default Toast;
