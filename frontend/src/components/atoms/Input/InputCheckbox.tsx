import {cn} from '#/components/utils';
import React from 'react';
import {type FieldError} from 'react-hook-form';

namespace InputCheckbox {
  export type Props = Omit<React.ComponentProps<'input'>, 'type'> & {
    error?: FieldError;
    onCheckedChange?: (value: boolean) => void;
  };
}
function InputCheckbox({
  className,
  autoComplete = 'one-time-code',
  error,
  onCheckedChange,
  ...props
}: InputCheckbox.Props) {
  return (
    <input
      type="checkbox"
      autoComplete={autoComplete}
      onChange={e => {
        onCheckedChange?.(e.target.checked);
        props.onChange?.(e);
      }}
      className={cn('checkbox', error && 'input-error', className)}
      {...props}
    />
  );
}

export default InputCheckbox;
