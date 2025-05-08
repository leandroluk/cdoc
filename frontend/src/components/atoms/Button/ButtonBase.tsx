import {cn} from '#/components/utils';

namespace ButtonBase {
  export type Props = React.ComponentProps<'button'>;
}
function ButtonBase({className, children, ...props}: ButtonBase.Props) {
  return (
    <button className={cn('btn', className)} {...props}>
      {children}
    </button>
  );
}

export default ButtonBase;
