import userStore from '#/stores/userStore';
import {cn} from '#/utils';
import React from 'react';
import {PiPen} from 'react-icons/pi';
import Button from '../atoms/Button';
import Form from '../atoms/Form';
import Input from '../atoms/Input';

namespace UploadAvatarForm {
  export type Props = Omit<React.ComponentProps<'button'>, 'children'>;
}
function UploadAvatarForm({className, onClick, ...props}: UploadAvatarForm.Props) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [loading, setLoading] = React.useState(false);
  const uploadUserProfileFile = userStore(_ => _.uploadUserProfileFile);

  const close = () => dialogRef.current?.close();

  const handleUpload = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const file = fileInputRef.current?.files?.[0];
      if (file) {
        try {
          setLoading(true);
          await uploadUserProfileFile(file);
          dialogRef.current?.close();
        } finally {
          setLoading(true);
        }
      }
    },
    [setLoading, dialogRef, uploadUserProfileFile]
  );

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    dialogRef.current?.showModal();
    onClick?.(e);
  };

  return (
    <>
      <button className={cn('btn btn-ghost', className)} onClick={handleClick} {...props}>
        <PiPen className="size-5 text-base-content" />
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-backdrop" onClick={close} />
        <div className="modal-box">
          <h3 className="font-bold text-lg">Upload de Arquivo</h3>
          <Form method="dialog" onSubmit={handleUpload} className="space-y-4 mt-4">
            <Form.Control>
              <Input.File ref={fileInputRef} />
            </Form.Control>

            <Form.Control className="grid grid-cols-3 gap-3">
              <Button type="button" className="btn col-start-2" onClick={close}>
                Cancelar
              </Button>

              <Button.Loadable type="submit" className="btn btn-primary" loading={loading} disabled={loading}>
                Enviar
              </Button.Loadable>
            </Form.Control>
          </Form>
        </div>
      </dialog>
    </>
  );
}

export default UploadAvatarForm;
