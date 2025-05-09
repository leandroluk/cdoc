import {setCookie} from '#/utils';
import {COOKIE_THEME_VALUE, ETheme} from '@cdoc/domain';

function setDocumentTheme(theme: ETheme): void {
  document.documentElement.setAttribute('data-theme', theme);
  setCookie(COOKIE_THEME_VALUE, theme);
  const favicon = document.getElementById('favicon') as HTMLLinkElement;
  favicon.href = theme === ETheme.Light ? '/favicon.light.svg' : '/favicon.dark.svg';
}

export default setDocumentTheme;
