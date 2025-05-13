import {cn} from '#/utils';
import {type HTMLMotionProps, motion} from 'framer-motion';
import React from 'react';
import LoaderRoot from './LoaderRoot';

namespace LoaderSuspense {
  export type Props<T extends React.ComponentType<any>> = Omit<HTMLMotionProps<'div'>, 'children'> & {
    children?: React.ReactNode | React.LazyExoticComponent<T>;
  };
}

function LoaderSuspense<T extends React.ComponentType<any>>({
  children = <></>,
  className,
  ...props
}: LoaderSuspense.Props<T>) {
  return (
    <React.Suspense fallback={<LoaderRoot className="absolute w-screen h-screen z-50 top-0 left-0" key="loader" />}>
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{ease: 'easeOut'}}
        key="lazy-content"
        className={cn('flex flex-col flex-1', className)}
        {...props}
      >
        {React.isValidElement(children)
          ? children
          : ['function', 'object'].includes(typeof children)
            ? React.createElement(children as unknown as T)
            : null}
      </motion.div>
    </React.Suspense>
  );
}

export default LoaderSuspense;
