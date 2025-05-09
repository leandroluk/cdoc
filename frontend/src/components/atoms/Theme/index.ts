import ThemeObserver from './ThemeObserver';
import ThemeToggle from './ThemeToggle';

const Theme = Object.assign(ThemeToggle, {
  Toggle: ThemeToggle,
  Observer: ThemeObserver,
});

export default Theme;
