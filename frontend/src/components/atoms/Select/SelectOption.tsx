import {cn} from '#/utils';

namespace SelectOption {
  export type Props = React.ComponentProps<'option'>;
}
function SelectOption({className, children, ...props}: SelectOption.Props) {
  return (
    <option className={cn('', className)} {...props}>
      {children}
    </option>
  );
}

export default SelectOption;
