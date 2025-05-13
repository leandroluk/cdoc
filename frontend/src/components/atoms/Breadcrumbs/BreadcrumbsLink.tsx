import {cn} from '#/utils';
import {PiHouse} from 'react-icons/pi';
import {useNavigate} from 'react-router';

namespace BreadcrumbsLink {
  export type Props = React.ComponentProps<'li'> & {
    path: string;
  };
}
function BreadcrumbsLink({className, children = <PiHouse />, path, ...props}: BreadcrumbsLink.Props) {
  const navigate = useNavigate();
  return (
    <li onClick={() => navigate(path)} className={cn('btn btn-ghost btn-link', className)} {...props}>
      {children}
    </li>
  );
}
export default BreadcrumbsLink;
