import {cn} from '#/utils';
import React from 'react';
import {type FieldError} from 'react-hook-form';
import Input from '../Input';
import FormDescription from './FormDescription';
import FormLabel from './FormLabel';

namespace FormControl {
  export type Props = React.ComponentProps<'fieldset'> & {
    error?: FieldError;
  };
}

const labelComponentNames = ['label', FormLabel.name];
const inputComponentNames = Object.values(Input).map(item => item.name);
const htmlFormElementTags = ['input', 'select', 'textarea'];

function FormControl({className, children, error, ...props}: FormControl.Props) {
  let label: React.ReactNode = null;
  let description: React.ReactNode = null;
  const rest: React.ReactNode[] = [];

  React.Children.forEach(children, (child, index) => {
    if (React.isValidElement<HTMLElement & {error: FieldError}>(child)) {
      const displayName = (child.type as any)?.displayName || (child.type as any)?.name;
      const props = {...child.props, error, key: `fieldset-${index}`};
      if (labelComponentNames.includes(displayName)) {
        label = React.cloneElement(child, props);
      } else if (displayName === FormDescription.name) {
        description = React.cloneElement(child, props);
      } else if (inputComponentNames.includes(displayName)) {
        rest.push(React.cloneElement(child, props));
      } else if (htmlFormElementTags.includes(child.type as any)) {
        props.className = cn('input input-bordered', error && 'input-error', props.className);
        rest.push(React.cloneElement(child, props));
      } else {
        rest.push(React.cloneElement(child, props));
      }
      return;
    }
    rest.push(child);
  });

  return (
    <fieldset className={cn('fieldset [&>*]:w-full', error && 'border-error', className)} {...props}>
      {label && React.cloneElement<FormLabel.Props>(label, {error})}
      {rest}
      {description && React.cloneElement<FormDescription.Props>(description, {error})}
    </fieldset>
  );
}

export default FormControl;
