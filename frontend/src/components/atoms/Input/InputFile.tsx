import {cn} from '#/utils';
import React from 'react';

namespace InputFile {
  export type Props = Omit<React.ComponentProps<'div'>, 'children' | 'ref' | 'onClick'> & {
    onClick?: React.MouseEventHandler<HTMLElement>;
    buttonClassName?: React.ComponentProps<'button'>['className'];
    spanClassName?: React.ComponentProps<'span'>['className'];
    ref?: React.Ref<HTMLInputElement>;
    onChange?: (file: File | null) => void;
    prefixText?: string;
    noSelectedFileText?: string;
  };
}
function InputFile({
  className,
  buttonClassName,
  spanClassName,
  ref,
  onChange,
  onClick,
  prefixText = 'Escolher arquivo',
  noSelectedFileText = 'Nenhum arquivo selecionado',
  ...props
}: InputFile.Props) {
  const localFileRef = React.useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = React.useState(noSelectedFileText);

  React.useImperativeHandle(ref, () => localFileRef.current as HTMLInputElement, [localFileRef]);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    localFileRef.current?.click();
    onClick?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFileName(file ? file.name : noSelectedFileText);
    onChange?.(file);
  };

  return (
    <div className={cn('file-input', className)} onClick={handleClick} {...props}>
      <input type="file" ref={localFileRef} onChange={handleChange} className="hidden" />
      <button type="button" className={cn('btn', buttonClassName)}>
        {prefixText}
      </button>
      <span className={cn('ml-2 text-sm text-base-content', spanClassName)}>{fileName}</span>
    </div>
  );
}

export default InputFile;
