import Avatar from '#/components/atoms/Avatar';
import {ROUTES} from '#/constants';
import userStore from '#/stores/userStore';
import {cn} from '#/utils';
import {PiCaretUpDown, PiSignOut, PiUser} from 'react-icons/pi';
import {useLocation, useNavigate} from 'react-router';

function SidebarFooter() {
  const location = useLocation();
  const navigate = useNavigate();
  const {user} = userStore();

  return (
    <div className="dropdown p-3 dropdown-top dropdown-end w-full group transition-all hover:bg-base-100">
      <div
        tabIndex={0}
        role="button"
        className="cursor-pointer flex flex-row gap-3 items-center max-w-full rounded-md w-full box-border min-w-0"
      >
        <Avatar
          src={user?.Profile.avatarPicture}
          placeholder={user?.Profile.avatarPlaceholder}
          childClassName="size-10"
        />

        <div className="flex flex-col gap-1 text-xs flex-1 text-start">
          <div className="truncate font-bold w-full tooltip tooltip-open" data-tip={user?.Profile.fullName}>
            {user?.Profile.fullName}
          </div>
          <small className="truncate font-medium italic w-full">{user?.email}</small>
        </div>
        <PiCaretUpDown className="min-h-3 min-w-3" />
      </div>

      <ul tabIndex={0} className="dropdown-content menu bg-base-100 shadow -translate-x-3">
        <li onClick={() => navigate(ROUTES.PROFILE)}>
          <span className={cn({'active text-primary': location.pathname === ROUTES.PROFILE})}>
            <PiUser /> Perfil
          </span>
        </li>
        <li onClick={() => navigate(ROUTES.LOGOFF)}>
          <span>
            <PiSignOut /> Sair
          </span>
        </li>
      </ul>
    </div>
  );
}

export default SidebarFooter;
