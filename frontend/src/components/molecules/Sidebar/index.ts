import SidebarFooter from './SidebarFooter';
import SidebarHeader from './SidebarHeader';
import SidebarMenu from './SidebarMenu';
import SidebarRoot from './SidebarRoot';

const Sidebar = Object.assign(SidebarRoot, {
  Footer: SidebarFooter,
  Header: SidebarHeader,
  Menu: SidebarMenu,
  Root: SidebarRoot,
});

export default Sidebar;
