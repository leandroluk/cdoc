import packageJson from 'package.json';
import React from 'react';
import {Outlet} from 'react-router';
import {cn} from '../../utils';

namespace AuthTemplate {
  export type Props = React.ComponentProps<'main'>;
}
function AuthTemplate({children = <Outlet />, className, ...props}: AuthTemplate.Props) {
  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col justify-center items-center bg-base-200 gap-4">
      <header className="flex flex-row gap-4 justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44.32 44.32" className="size-8">
          <path
            className="fill-primary"
            d="M22.16,10.86a11.3,11.3,0,1,0,11.3,11.3,11.31,11.31,0,0,0-11.3-11.3m0,33.46A22.16,22.16,0,1,1,44.32,22.16,22.18,22.18,0,0,1,22.16,44.32"
          />
          <path className="fill-primary-content" d="M28.25,22.16a6.09,6.09,0,1,0-6.09,6.08,6.09,6.09,0,0,0,6.09-6.08" />
        </svg>

        <h1 className="font-semibold text-xl text-base-content">{packageJson.displayName}</h1>
      </header>

      <main className={cn('bg-base-100 p-6 flex flex-col min-w-sm rounded-lg', className)} {...props}>
        {children}
      </main>

      <footer className="text-xs max-w-sm text-center">
        Criado por{' '}
        <a href="https://www.oppem.com.br/" target="_blank" className="underline">
          Oppem
        </a>{' '}
        . Todos os direitos reservados
      </footer>
    </div>
  );
}

export default AuthTemplate;
