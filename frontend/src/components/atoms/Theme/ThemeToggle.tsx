import {cn} from '#/utils';
import {ETheme} from '@cdoc/domain';
import React from 'react';
import {PiComputerTower, PiMoon, PiSun} from 'react-icons/pi';
import setDocumentTheme from './setDocumentTheme';

const themeMap = {
  [ETheme.Dark]: (
    <>
      <PiMoon /> Escuro
    </>
  ),
  [ETheme.Light]: (
    <>
      <PiSun /> Claro
    </>
  ),
  [ETheme.System]: (
    <>
      <PiComputerTower /> Sistema
    </>
  ),
};

namespace ThemeToggle {
  export type Props = Omit<React.ComponentProps<'div'>, 'onChange'> & {
    value?: ETheme;
    initialValue?: ETheme;
    onChange: (value: ETheme) => void;
    btnClassName?: string;
    btnActiveClassName?: string;
  };
}

function ThemeToggle({
  className,
  initialValue,
  onChange,
  btnClassName,
  btnActiveClassName,
  ...props
}: ThemeToggle.Props) {
  const [value, setValue] = React.useState(initialValue);
  React.useLayoutEffect(() => {
    if (value) {
      setDocumentTheme(value === ETheme.System ? getSystemTheme() : value);
    }
  }, [value]);

  const handleChange = (theme: ETheme) => () => {
    onChange?.(theme);
    setValue(theme);
  };

  return (
    <div className={cn('join', className)} {...props}>
      {Object.entries(themeMap).map(([key, children]) => (
        <button
          type="button"
          key={key}
          className={cn(
            'btn join-item gap-3',
            btnClassName,
            value === (key as ETheme) && ['btn-active bg-base-100 border-b-2 border-b-primary', btnActiveClassName]
          )}
          onClick={handleChange(key as ETheme)}
          children={children}
        />
      ))}
    </div>
  );
}

function getSystemTheme(): ETheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? ETheme.Dark : ETheme.Light;
}

export default ThemeToggle;
