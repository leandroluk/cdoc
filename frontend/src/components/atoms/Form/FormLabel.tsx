import {cn} from '#/utils';
import React from 'react';
import {type FieldError} from 'react-hook-form';

namespace FormLabel {
  export type Props = React.ComponentProps<'legend'> & {
    error?: FieldError;
  };
}
function FormLabel({className, children, error, ...props}: FormLabel.Props) {
  return (
    <legend className={cn('fieldset-legend', error && 'text-error', className)} {...props}>
      {children}
    </legend>
  );
}

export default FormLabel;
