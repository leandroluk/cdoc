import {userStore} from '#/stores/userStore';
import {getCookie} from '#/utils';
import {COOKIE_THEME_VALUE, type ETheme} from '@cdoc/domain';
import React from 'react';
import setDocumentTheme from './setDocumentTheme';

function ThemeObserver() {
  const profileTheme = userStore(_ => _.profile?.theme);
  const ref = React.useRef(false);

  React.useLayoutEffect(() => {
    const cookie = getCookie(COOKIE_THEME_VALUE) as ETheme | null;
    if (cookie) {
      setDocumentTheme(cookie);
    }
  }, []);

  React.useLayoutEffect(() => {
    if (profileTheme && !ref.current) {
      ref.current = true;
      const currentTheme = getCookie(COOKIE_THEME_VALUE);
      if (profileTheme !== currentTheme) {
        setDocumentTheme(profileTheme);
      }
    }
  }, [profileTheme]);

  return null;
}

export default ThemeObserver;
