import {cn} from '#/components/utils';
import {AnimatePresence, motion} from 'motion/react';
import {PiCheckCircle, PiInfo, PiWarning, PiX, PiXCircle} from 'react-icons/pi';
import useToastStore, {type ToastType} from './useToastStore';

const typeStyles: Record<ToastType, string> = {
  info: 'alert-info',
  success: 'alert-success',
  warning: 'alert-warning',
  error: 'alert-error',
};

const typeIcons: Record<ToastType, React.ReactNode> = {
  info: <PiInfo className="size-5" />,
  success: <PiCheckCircle className="size-5" />,
  warning: <PiWarning className="size-5" />,
  error: <PiXCircle className="size-5" />,
};

function ToastWrapper() {
  const {toasts, remove} = useToastStore();

  return (
    <div
      className={cn(
        'fixed bottom-4 z-50 flex flex-col items-center space-y-3 w-full',
        'md:items-end md:right-4 md:w-auto'
      )}
    >
      <AnimatePresence>
        {toasts.map(({id, title, description, type = 'info', icon = typeIcons[type], soft = false}) => (
          <motion.div
            key={id}
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: 30}}
            className={cn(
              'alert shadow-lg max-w-sm w-[90%] sm:w-[24rem]',
              soft && 'alert-soft',
              typeStyles[type],
              'relative pr-10'
            )}
          >
            <div className="flex items-center gap-3">
              {icon && <span>{icon || typeIcons[type]}</span>}
              <div className="flex flex-col items-start">
                <div className="font-bold">{title}</div>
                {description && <div className="text-sm opacity-80">{description}</div>}
              </div>
            </div>
            <button
              className="absolute top-2 right-2 text-base opacity-70 hover:opacity-100 cursor-pointer"
              onClick={() => remove(id)}
            >
              <PiX className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ToastWrapper;
