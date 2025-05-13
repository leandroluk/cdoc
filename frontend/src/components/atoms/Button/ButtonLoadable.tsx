import {cn} from '#/utils';
import {PiSpinnerGap} from 'react-icons/pi';

namespace ButtonLoadable {
  export type Props = React.ComponentProps<'button'> & {
    loading: boolean;
    innerClassName?: string;
  };
}
function ButtonLoadable({className, children, loading = false, innerClassName, ...props}: ButtonLoadable.Props) {
  return (
    <button data-loading={loading} className={cn('btn relative group', className)} {...props}>
      <span
        className={cn(
          'absolute transition-opacity group-data-[loading=false]:opacity-0',
          'flex flex-col justify-center items-center w-full h-full'
        )}
      >
        <span className="size-5 animate-spin flex justify-center items-center">
          <PiSpinnerGap className="size-5 animate-spin-steps" />
        </span>
      </span>
      <div className={cn('transition-opacity group-data-[loading=true]:opacity-0 flex flex-col', innerClassName)}>
        {children}
      </div>
    </button>
  );
}

export default ButtonLoadable;
