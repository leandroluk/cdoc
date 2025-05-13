import {sidebarStore} from '#/stores/sidebarStore';
import {cn} from '#/utils';
import {AnimatePresence, motion} from 'motion/react';
import React from 'react';
import {PiSidebar} from 'react-icons/pi';

namespace PageTemplateHeader {
  export type Props = React.ComponentProps<'header'>;
}
function PageTemplateHeader({children, className, ...props}: PageTemplateHeader.Props) {
  const {isOpen: isOpenSidebar, open: openSidebar} = sidebarStore();

  return (
    <header className={cn('bg-base-200 flex flex-row h-16 items-center p-3 gap-3', className)} {...props}>
      <AnimatePresence mode="wait">
        {!isOpenSidebar && (
          <motion.div
            key="sidebar-button"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {opacity: 0, x: -20, transition: {duration: 0.2}},
              visible: {opacity: 1, x: 0, transition: {duration: 0.2}},
            }}
            transition={{type: 'spring', stiffness: 200, damping: 25}}
          >
            <button className="btn btn-square rounded" onClick={openSidebar}>
              <PiSidebar className="size-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </header>
  );
}

export default PageTemplateHeader;
