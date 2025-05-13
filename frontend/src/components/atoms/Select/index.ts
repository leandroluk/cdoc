import SelectOption from './SelectOption';
import SelectRoot from './SelectRoot';

const Select = Object.assign(SelectRoot, {
  Root: SelectRoot,
  Option: SelectOption,
});

export default Select;
