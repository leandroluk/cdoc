import setDocumentTheme from './setDocumentTheme';
import ThemeToggle from './ThemeToggle';

const Theme = Object.assign(ThemeToggle, {
  Toggle: ThemeToggle,
  setDocumentTheme,
});

export default Theme;
