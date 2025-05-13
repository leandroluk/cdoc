import packageJson from 'package.json';
import React from 'react';
import {Outlet} from 'react-router';
import {cn} from '../../utils';
import Svg from '../atoms/Svg';

namespace AuthTemplate {
  export type Props = React.ComponentProps<'main'>;
}
function AuthTemplate({children = <Outlet />, className, ...props}: AuthTemplate.Props) {
  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col justify-center items-center bg-base-300 gap-3">
      <header className="flex flex-row gap-3 justify-center items-center">
        <Svg.Favicon />
        <h1 className="font-semibold text-xl text-base-content">{packageJson.displayName}</h1>
      </header>

      <main className={cn('bg-base-100 p-6 flex flex-col w-xs md:w-sm rounded-lg', className)} {...props}>
        {children}
      </main>

      <footer className="text-xs max-w-sm text-center">
        Criado por{' '}
        <a href="https://www.oppem.com.br/" target="_blank" className="underline">
          Oppem
        </a>{' '}
        . Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default AuthTemplate;
