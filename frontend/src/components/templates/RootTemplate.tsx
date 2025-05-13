import {Outlet} from 'react-router';
import {cn} from '../../utils';
import Toast from '../atoms/Toast';

namespace RootTemplate {
  export type Props = React.ComponentProps<'div'>;
}
function RootTemplate({children = <Outlet />, className, ...props}: RootTemplate.Props) {
  return (
    <div className={cn('h-screen', className)} {...props}>
      {children}
      <Toast.Wrapper />
    </div>
  );
}

export default RootTemplate;
