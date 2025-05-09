import {cn} from '#/utils';
import React from 'react';
import {type FieldError} from 'react-hook-form';

type MaskPattern = string | ((rawValue: string) => string);

const markCharRegexMap: Record<string, RegExp> = {
  '9': /\d/,
  A: /[a-zA-Z]/,
  '*': /[a-zA-Z0-9]/,
};

function isValidChar(maskChar: string, inputChar: string): boolean {
  return markCharRegexMap[maskChar]?.test(inputChar) || false;
}

function applyMask(value: string, mask: string): string {
  let masked = '';
  let valIndex = 0;

  for (let i = 0; i < mask.length; i++) {
    const maskChar = mask[i];

    if (Object.keys(markCharRegexMap).includes(maskChar)) {
      while (valIndex < value.length) {
        const inputChar = value[valIndex];
        if (isValidChar(maskChar, inputChar)) {
          masked += inputChar;
          valIndex++;
          break;
        } else {
          valIndex++;
        }
      }
    } else {
      masked += maskChar;
    }
  }

  return masked;
}

function extractRaw(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '');
}

namespace InputMask {
  export type Props = Omit<React.ComponentProps<'input'>, 'value' | 'onChange'> & {
    error?: FieldError;
    mask: MaskPattern;
    value?: string;
    onChange: Required<React.ComponentProps<'input'>>['onChange'];
  };
}
function InputMask({error, className, mask, value = '', onChange, onBlur, name, ...rest}: InputMask.Props) {
  const [rawValue, setRawValue] = React.useState(extractRaw(value));

  const resolvedMask = typeof mask === 'function' ? mask(rawValue) : mask;
  const masked = applyMask(rawValue, resolvedMask || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = extractRaw(e.target.value);
    const selectedMask = typeof mask === 'function' ? mask(rawValue) : mask;
    const newMasked = applyMask(rawValue, selectedMask);
    setRawValue(rawValue);
    onChange({...e, target: {...e.target, value: newMasked}});
  };

  return (
    <input
      {...rest}
      className={cn('input', error && 'input-error', className)}
      name={name}
      value={masked}
      onChange={handleChange}
      onBlur={onBlur}
    />
  );
}

export default InputMask;
