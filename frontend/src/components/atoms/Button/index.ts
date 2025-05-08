import ButtonBase from './ButtonBase';
import ButtonLoadable from './ButtonLoadable';

const Button = Object.assign(ButtonBase, {
  Base: ButtonBase,
  Loadable: ButtonLoadable,
});

export default Button;
