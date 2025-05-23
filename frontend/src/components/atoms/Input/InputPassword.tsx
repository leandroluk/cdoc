import {cn} from '#/utils';
import React from 'react';
import {type FieldError} from 'react-hook-form';
import {PiEye, PiEyeClosed} from 'react-icons/pi';

namespace InputPassword {
  export type Props = Omit<React.ComponentProps<'input'>, 'type'> & {
    error?: FieldError;
    inputClassName?: React.ComponentProps<'input'>['className'];
    initialVisible?: boolean;
  };
}
function InputPassword({
  className,
  inputClassName,
  autoComplete = 'one-time-code',
  error,
  initialVisible = false,
  ...props
}: InputPassword.Props) {
  const [visible, setVisible] = React.useState(initialVisible);

  return (
    <label className={cn('input input-bordered flex items-center gap-3', error && 'input-error', className)}>
      <input
        {...props}
        autoComplete={autoComplete}
        type={visible ? 'text' : 'password'}
        className={cn('grow', inputClassName)}
      />
      <button
        type="button"
        className="text-sm opacity-50 hover:opacity-100 transition-opacity"
        onClick={() => setVisible(value => !value)}
      >
        {visible ? <PiEyeClosed className="size-5" /> : <PiEye className="size-5" />}
      </button>
    </label>
  );
}

export default InputPassword;
