import {cn} from '#/utils';

namespace SvgFavicon {
  export type Props = React.ComponentProps<'svg'>;
}
function SvgFavicon({className, ...props}: SvgFavicon.Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44.32 44.32" className={cn('size-8', className)} {...props}>
      <path
        className="fill-primary"
        d="M22.16,10.86a11.3,11.3,0,1,0,11.3,11.3,11.31,11.31,0,0,0-11.3-11.3m0,33.46A22.16,22.16,0,1,1,44.32,22.16,22.18,22.18,0,0,1,22.16,44.32"
      />
      <path className="fill-base-content" d="M28.25,22.16a6.09,6.09,0,1,0-6.09,6.08,6.09,6.09,0,0,0,6.09-6.08" />
    </svg>
  );
}

export default SvgFavicon;
