import {cn} from '#/utils';
import React from 'react';
import Image from './Image';

namespace Avatar {
  export type Props = Omit<React.ComponentProps<'div'>, 'children'> & {
    src?: string;
    alt?: string;
    placeholder?: string;
    childClassName?: HTMLDivElement['className'];
  };
}
function Avatar({className, childClassName, src, alt, placeholder = '', ...props}: Avatar.Props) {
  return (
    <div className={cn('avatar', !src && 'avatar-placeholder', className)} {...props}>
      <div className={cn('rounded-full', !src && 'bg-base-300 text-content', childClassName)}>
        {src ? <Image src={src} alt={alt} /> : <span className="text-md">{placeholder}</span>}
      </div>
    </div>
  );
}

export default Avatar;
