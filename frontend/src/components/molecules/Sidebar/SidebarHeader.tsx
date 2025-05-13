import Svg from '#/components/atoms/Svg';
import {ROUTES} from '#/constants';
import {sidebarStore} from '#/stores/sidebarStore';
import packageJson from 'package.json';
import {PiSidebarSimple} from 'react-icons/pi';
import {useNavigate} from 'react-router';

function SidebarHeader() {
  const navigate = useNavigate();
  const closeSidebar = sidebarStore(_ => _.close);
  return (
    <header className="grid grid-cols-[auto_min-content] gap-3 p-3">
      <div
        onClick={() => navigate(ROUTES.DASHBOARD)}
        className="cursor-pointer grid grid-cols-[min-content_auto] gap-3 items-center "
      >
        <Svg.Favicon className="h-10" />

        <h1 className="text-2xl font-black">{packageJson.displayName}</h1>
      </div>

      <button className="btn btn-square rounded" onClick={closeSidebar}>
        <PiSidebarSimple className="size-5" />
      </button>
    </header>
  );
}

export default SidebarHeader;
