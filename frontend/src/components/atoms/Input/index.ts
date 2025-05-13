import InputBase from './InputBase';
import InputCheckbox from './InputCheckbox';
import InputFile from './InputFile';
import InputMask from './InputMask';
import InputPassword from './InputPassword';

export const Input = Object.assign(InputBase, {
  Base: InputBase,
  Checkbox: InputCheckbox,
  File: InputFile,
  Mask: InputMask,
  Password: InputPassword,
});

export default Input;
