import {cn} from '#/utils';
import React from 'react';
import {PiSpinnerGapDuotone} from 'react-icons/pi';

namespace LoaderRoot {
  export type Props = React.ComponentProps<'div'>;
}
function LoaderRoot({className, ...props}: LoaderRoot.Props) {
  return (
    <div className={cn('flex justify-center items-center', className)} {...props}>
      <PiSpinnerGapDuotone className="size-8 animate-spin-steps" />
    </div>
  );
}

export default LoaderRoot;
