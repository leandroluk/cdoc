import InputBase from './InputBase';
import InputCheckbox from './InputCheckbox';
import InputCode from './InputCode';
import InputPassword from './InputPassword';

export const Input = Object.assign(InputBase, {
  Base: InputBase,
  Checkbox: InputCheckbox,
  Code: InputCode,
  Password: InputPassword,
});

export default Input;
