import {sidebarStore} from '#/stores/sidebarStore';
import {cn} from '#/utils';
import {motion} from 'motion/react';
import SidebarFooter from './SidebarFooter';
import SidebarHeader from './SidebarHeader';
import SidebarMenu from './SidebarMenu';

const SIDEBAR_WIDTH = 250;

namespace SidebarRoot {
  export type Props = Omit<React.ComponentProps<typeof motion.aside>, 'initial' | 'animate' | 'transition'>;
}
function SidebarRoot({
  className,
  children = (
    <>
      <SidebarHeader />
      <SidebarMenu />
      <SidebarFooter />
    </>
  ),
  ...props
}: SidebarRoot.Props) {
  const isOpenSidebar = sidebarStore(_ => _.isOpen);

  return (
    <motion.aside
      initial={false}
      animate={{width: isOpenSidebar ? SIDEBAR_WIDTH : 0}} // ajuste 240 para a largura desejada
      transition={{type: 'spring', stiffness: 200, damping: 25}}
      className={cn(
        'bg-base-200 h-screen grid grid-rows-[min-content_auto_min-content] gap-3 [&>*]:min-w-0',
        className
      )}
      {...props}
    >
      {children}
    </motion.aside>
  );
}

export default SidebarRoot;
