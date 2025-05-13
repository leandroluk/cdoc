import {cn} from '#/utils';

namespace BreadcrumbsList {
  export type Props = Omit<React.ComponentProps<'ul'>, 'children'> & {
    children: React.ReactNode;
  };
}
function BreadcrumbsList({className, children, ...props}: BreadcrumbsList.Props) {
  return (
    <ul className={cn('', className)} {...props}>
      {children}
    </ul>
  );
}

export default BreadcrumbsList;
