import {Outlet} from 'react-router';
import Toast from '../atoms/Toast';
import {cn} from '../utils';

namespace MainTemplate {
  export type Props = React.ComponentProps<'div'>;
}
function MainTemplate({children = <Outlet />, className, ...props}: MainTemplate.Props) {
  return (
    <div className={cn('min-h-screen', className)} {...props}>
      {children}
      <Toast.Wrapper />
    </div>
  );
}

export default MainTemplate;
