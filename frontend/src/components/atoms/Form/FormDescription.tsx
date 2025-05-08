import {cn} from '#/components/utils';
import {type FieldError} from 'react-hook-form';

namespace FormDescription {
  export type Props = React.ComponentProps<'p'> & {
    error?: FieldError;
  };
}
function FormDescription({className, children, error, ...props}: FormDescription.Props) {
  return (
    <p className={cn('fieldset-label', error && 'text-error', className)} {...props}>
      {children ?? error?.message}
    </p>
  );
}

export default FormDescription;
