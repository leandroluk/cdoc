import {userStore} from '#/stores/userStore';
import {cn, getCookie} from '#/utils';
import {COOKIE_THEME_VALUE, ETheme} from '@cdoc/domain';
import React from 'react';
import {PiComputerTowerDuotone, PiMoonDuotone, PiSunDuotone} from 'react-icons/pi';
import setDocumentTheme from './setDocumentTheme';

function getSystemTheme(): ETheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? ETheme.Dark : ETheme.Light;
}

const themeMap = {
  [ETheme.Dark]: (
    <>
      <PiMoonDuotone /> Escuro
    </>
  ),
  [ETheme.Light]: (
    <>
      <PiSunDuotone /> Claro
    </>
  ),
  [ETheme.System]: (
    <>
      <PiComputerTowerDuotone /> Sistema
    </>
  ),
};

namespace ThemeToggle {
  export type Props = React.ComponentProps<'div'> & {
    btnClassName?: string;
    btnActiveClassName?: string;
  };
}
function ThemeToggle({className, btnClassName, btnActiveClassName, ...props}: ThemeToggle.Props) {
  const profileTheme = userStore(state => state.profile?.theme);
  const [theme, setTheme] = React.useState<ETheme>(ETheme.System);

  React.useLayoutEffect(() => {
    const saved = getCookie<ETheme>(COOKIE_THEME_VALUE);
    setTheme(profileTheme ? profileTheme : saved || ETheme.System);
  }, [profileTheme]);

  React.useLayoutEffect(() => {
    setDocumentTheme(theme === ETheme.System ? getSystemTheme() : theme);
  }, [theme]);

  return (
    <div className={cn('join', className)} {...props}>
      {Object.entries(themeMap).map(([key, children]) => (
        <button
          key={key}
          className={cn(
            'btn join-item gap-2',
            btnClassName,
            theme === (key as ETheme) && ['btn-active', btnActiveClassName]
          )}
          onClick={() => setTheme(key as ETheme)}
          children={children}
        />
      ))}
    </div>
  );
}

export default ThemeToggle;
