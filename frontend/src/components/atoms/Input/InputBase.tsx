import {cn} from '#/components/utils';
import type React from 'react';
import {type FieldError} from 'react-hook-form';

namespace InputBase {
  export type Props = React.ComponentProps<'input'> & {
    error?: FieldError;
  };
}
function InputBase({className, autoComplete = 'one-time-code', error, ...props}: InputBase.Props) {
  return <input autoComplete={autoComplete} className={cn('input', error && 'input-error', className)} {...props} />;
}

export default InputBase;
