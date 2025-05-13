import React from 'react';
import {cn} from '../../../utils';
import PageTemplateFooter from './PageTemplateFooter';
import PageTemplateHeader from './PageTemplateHeader';
import PageTemplateMain from './PageTemplateMain';

namespace PageTemplateRoot {
  export type Props = React.ComponentProps<'div'>;
}
function PageTemplateRoot({children, className, ...props}: PageTemplateRoot.Props) {
  const {
    header = <PageTemplateHeader />,
    main = <PageTemplateMain />,
    footer,
  } = React.Children.toArray(children).reduce((obj, child) => {
    if (React.isValidElement<HTMLElement>(child)) {
      const displayName = (child.type as any)?.displayName || (child.type as any)?.name;
      if (displayName === PageTemplateHeader.name) {
        obj.header = child;
      } else if (displayName === PageTemplateMain.name) {
        obj.main = child;
      } else if (displayName === PageTemplateFooter.name) {
        obj.footer = child;
      } else {
        throw TypeError(`PageTemplateRoot doesn't accept component ${displayName}`);
      }
      return obj;
    }
  }, {} as any);

  return (
    <section
      className={cn(
        'z-10 grid gap-3 h-screen',
        footer ? 'grid-rows-[min-content_auto_min-content]' : 'grid-rows-[min-content_auto]',
        className
      )}
      {...props}
    >
      {header}
      {main}
      {footer && footer}
    </section>
  );
}

export default PageTemplateRoot;
