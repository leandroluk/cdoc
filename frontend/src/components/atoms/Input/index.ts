import InputBase from './InputBase';
import InputCheckbox from './InputCheckbox';
import InputMask from './InputMask';
import InputPassword from './InputPassword';

export const Input = Object.assign(InputBase, {
  Base: InputBase,
  Checkbox: InputCheckbox,
  Mask: InputMask,
  Password: InputPassword,
});

export default Input;
