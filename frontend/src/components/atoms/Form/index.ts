import FormControl from './FormControl';
import FormDescription from './FormDescription';
import FormLabel from './FormLabel';
import FormRoot from './FormRoot';

const Form = Object.assign(FormRoot, {
  Control: FormControl,
  Description: FormDescription,
  Label: FormLabel,
  Root: FormRoot,
});

export default Form;
