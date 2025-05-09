import authService from '#/services/authService';
import {TOtpAuth} from '@cdoc/domain';
import {joiResolver} from '@hookform/resolvers/joi';
import deepmerge from 'deepmerge';
import Joi from 'joi';
import {messages} from 'joi-translation-pt-br';
import React from 'react';
import {useForm} from 'react-hook-form';
import Button from '../atoms/Button';
import Form from '../atoms/Form';
import Input from '../atoms/Input';
import Toast from '../atoms/Toast';

const schema = Joi.object<TOtpAuth.Data.Body>({
  email: TOtpAuth.Data.Body.schema.extract('email').label('Email'),
});

const toastProps = deepmerge(Toast.toastProps, {
  200: {description: 'Código OTP enviado. Verifique sua caixa de mensagens.'},
  404: {description: 'Não foi possível encontrar um usuário relacionado ao endereço de e-mail fornecido'},
});

namespace OtpAuthForm {
  export type Props = {
    onSend?: () => void;
  };
}
function OtpAuthForm({onSend}: OtpAuthForm.Props) {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<TOtpAuth.Data.Body>({
    resolver: joiResolver(schema, {messages}),
    defaultValues: {
      email: '',
    },
  });

  const handler = React.useCallback(
    async (body: TOtpAuth.Data.Body) => {
      try {
        setLoading(true);
        await authService.otpAuth(body);
        Toast.info(toastProps[200]);
        onSend?.();
      } catch (error: any) {
        Toast.error(toastProps[error?.status] ?? toastProps[500]);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, onSend]
  );

  return (
    <Form onSubmit={form.handleSubmit(handler)} className="flex flex-col">
      <Form.Control>
        <p className="alert alert-info alert-soft text-center">
          Digite o endereço de e-mail relacionado ao usuário para receber o código OTP (senha de uso único)
        </p>
      </Form.Control>

      <Form.Control error={form.formState.errors.email}>
        <Form.Label>Email</Form.Label>
        <Input placeholder="john.doe@email.com" {...form.register('email')} />
        <Form.Description />
      </Form.Control>

      <Form.Control>
        <Button.Loadable className="btn-primary w-full" disabled={loading} loading={loading}>
          Enviar
        </Button.Loadable>
      </Form.Control>
    </Form>
  );
}

export default OtpAuthForm;
