import {Outlet} from 'react-router';
import {cn} from '../../utils';
import Theme from '../atoms/Theme';
import Toast from '../atoms/Toast';

namespace MainTemplate {
  export type Props = React.ComponentProps<'div'>;
}
function MainTemplate({children = <Outlet />, className, ...props}: MainTemplate.Props) {
  return (
    <div className={cn('min-h-screen', className)} {...props}>
      {children}
      <Toast.Wrapper />
      <Theme.Observer />
    </div>
  );
}

export default MainTemplate;
