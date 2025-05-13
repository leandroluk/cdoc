import {cn} from '#/utils';

namespace SvgMicrosoft {
  export type Props = React.ComponentProps<'svg'>;
}
function SvgMicrosoft({className, ...props}: SvgMicrosoft.Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className={cn('size-4', className)} {...props}>
      <path className="fill-[#f25022]" d="M1 1h9v9H1z" />
      <path className="fill-[#00a4ef]" d="M1 11h9v9H1z" />
      <path className="fill-[#7fba00]" d="M11 1h9v9h-9z" />
      <path className="fill-[#ffb900]" d="M11 11h9v9h-9z" />
    </svg>
  );
}

export default SvgMicrosoft;
