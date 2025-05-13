import {cn} from '#/utils';
import React from 'react';

namespace PageTemplateMain {
  export type Props = React.ComponentProps<'main'>;
}
function PageTemplateMain({children, className, ...props}: PageTemplateMain.Props) {
  return (
    <main className={cn('flex flex-col justify-stretch px-3 items-stretch overflow-auto', className)} {...props}>
      {children}
    </main>
  );
}

export default PageTemplateMain;
