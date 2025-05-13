import {cn} from '#/utils';
import React from 'react';

namespace SelectRoot {
  export type Props = React.ComponentProps<'select'>;
}
function SelectRoot({className, children, ...props}: SelectRoot.Props) {
  return (
    <select className={cn('select', className)} {...props}>
      {children}
    </select>
  );
}

export default SelectRoot;
