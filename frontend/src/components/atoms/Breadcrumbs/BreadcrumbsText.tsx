import {cn} from '#/utils';
import React from 'react';

namespace BreadcrumbsText {
  export type Props = React.ComponentProps<'li'>;
}
function BreadcrumbsText({className, children, ...props}: BreadcrumbsText.Props) {
  return (
    <li className={cn('', className)} {...props}>
      {children}
    </li>
  );
}

export default BreadcrumbsText;
