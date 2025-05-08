import {cn} from '#/components/utils';
import React from 'react';
import {type FieldError} from 'react-hook-form';
import ReactInputMask from 'react-input-mask';

namespace InputCode {
  export type Props = Omit<React.ComponentProps<typeof ReactInputMask>, 'mask' | 'placeholder'> & {
    length: number;
    error?: FieldError;
  };
}
function InputCode({length, error, className, ...props}: InputCode.Props) {
  const mask = Array(length).fill('*').join(' - ');
  return (
    <ReactInputMask
      mask={mask}
      alwaysShowMask
      className={cn('input', error && 'input-error', className)}
      placeholder={mask}
      {...props}
    />
  );
}

export default InputCode;
