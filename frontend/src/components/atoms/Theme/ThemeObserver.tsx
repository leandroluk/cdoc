import {userStore} from '#/stores/userStore';
import {getCookie, setCookie} from '#/utils';
import {COOKIE_THEME_VALUE} from '@cdoc/domain';
import React from 'react';

function ThemeObserver() {
  const profileTheme = userStore(_ => _.profile?.theme);
  const ref = React.useRef(false);

  React.useLayoutEffect(() => {
    const cookie = getCookie(COOKIE_THEME_VALUE);
    if (cookie) {
      document.documentElement.setAttribute('data-theme', cookie);
    }
  }, []);

  React.useLayoutEffect(() => {
    if (profileTheme && !ref.current) {
      ref.current = true;
      const currentTheme = getCookie(COOKIE_THEME_VALUE);
      if (profileTheme !== currentTheme) {
        document.documentElement.setAttribute('data-theme', profileTheme);
        setCookie(COOKIE_THEME_VALUE, profileTheme);
      }
    }
  }, [profileTheme]);

  return null;
}

export default ThemeObserver;
