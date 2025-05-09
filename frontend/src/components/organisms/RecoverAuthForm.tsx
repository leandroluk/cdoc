import authService from '#/services/authService';
import {TRecoverAuth} from '@cdoc/domain';
import {joiResolver} from '@hookform/resolvers/joi';
import deepmerge from 'deepmerge';
import Joi from 'joi';
import {messages} from 'joi-translation-pt-br';
import React, {type ClipboardEventHandler} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router';
import Button from '../atoms/Button';
import Form from '../atoms/Form';
import Input from '../atoms/Input';
import Toast from '../atoms/Toast';

type Schema = TRecoverAuth.Data.Body & {
  confirmPassword: string;
};

const schema = Joi.object<Schema>({
  code: TRecoverAuth.Data.Body.schema.extract('code').label('Código OTP'),
  email: TRecoverAuth.Data.Body.schema.extract('email').label('Email'),
  password: TRecoverAuth.Data.Body.schema.extract('password').label('Senha'),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({'any.only': 'As senhas precisam ser iguais'})
    .label('Confirmar senha'),
});

const toastProps = deepmerge(Toast.toastProps, {
  200: {description: 'Senha alterada com sucesso'},
  404: {description: 'Não foi possível encontrar um usuário relacionado ao token'},
  406: {title: 'Token inválido', description: 'O token informado não é válido ou está expirado.'},
});

const disableCopyAndPaste: ClipboardEventHandler = event => {
  event.preventDefault();
  return false;
};

namespace RecoverAuthForm {
  export type Props = {email?: string};
}
function RecoverAuthForm({email = ''}: RecoverAuthForm.Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<Schema>({
    resolver: joiResolver(schema, {messages}),
    defaultValues: {
      code: '',
      email,
      password: '',
      confirmPassword: '',
    },
  });

  const handler = React.useCallback(
    async (body: TRecoverAuth.Data.Body) => {
      try {
        setLoading(true);
        await authService.recoverAuth(body);
        Toast.success(toastProps[200]);
        await navigate('/login', {replace: true});
      } catch (error: any) {
        Toast.error(toastProps[error?.status] ?? toastProps[500]);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, navigate]
  );

  return (
    <Form onSubmit={form.handleSubmit(handler)} className="flex flex-col">
      <Form.Control>
        <p className="alert alert-info alert-soft text-center">
          Informe o código que foi enviado para o email relacionado a conta para recuperar sua senha.
        </p>
      </Form.Control>

      <Form.Control error={form.formState.errors.code}>
        <Form.Label>Código OTP</Form.Label>
        <Input.Mask
          mask="9 - 9 - 9 - 9 - 9 - 9"
          className="text-center input-ghost bg-base-200 font-bold text-2xl"
          {...form.register('code', {setValueAs: value => value.replace(/\D/g, '')})}
        />
        <Form.Description />
      </Form.Control>

      <Form.Control error={form.formState.errors.email}>
        <Form.Label>Email</Form.Label>
        <Input placeholder="john.doe@email.com" {...form.register('email')} />
        <Form.Description />
      </Form.Control>

      <Form.Control error={form.formState.errors.password}>
        <Form.Label>Senha</Form.Label>
        <Input.Password
          placeholder="********"
          onCopy={disableCopyAndPaste}
          onPaste={disableCopyAndPaste}
          {...form.register('password')}
        />
        <Form.Description />
      </Form.Control>

      <Form.Control error={form.formState.errors.confirmPassword}>
        <Form.Label>Confirmar senha</Form.Label>
        <Input.Password
          placeholder="********"
          onCopy={disableCopyAndPaste}
          onPaste={disableCopyAndPaste}
          {...form.register('confirmPassword')}
        />
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

export default RecoverAuthForm;
