import {cn} from '#/utils';
import React from 'react';

namespace PageTemplateFooter {
  export type Props = React.ComponentProps<'footer'>;
}
function PageTemplateFooter({children, className, ...props}: PageTemplateFooter.Props) {
  return (
    <footer className={cn('flex flex-row justify-stretch p-3 min-h-16', className)} {...props}>
      {children}
    </footer>
  );
}

export default PageTemplateFooter;
