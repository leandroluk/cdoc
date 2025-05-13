import {cn} from '#/utils';

namespace BreadcrumbsRoot {
  export type Props = Omit<React.ComponentProps<'div'>, 'children'> & {
    children: React.ReactNode;
  };
}
function BreadcrumbsRoot({className, children, ...props}: BreadcrumbsRoot.Props) {
  return (
    <div className={cn('breadcrumbs', className)} {...props}>
      {children}
    </div>
  );
}

export default BreadcrumbsRoot;
