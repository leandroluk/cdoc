import authService from '#/services/authService';
import {TLoginAuthCredential} from '@cdoc/domain';
import {joiResolver} from '@hookform/resolvers/joi';
import Joi from 'joi';
import {messages} from 'joi-translation-pt-br';
import React from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate, useSearchParams} from 'react-router';
import {cn} from '../../utils';
import Button from '../atoms/Button';
import Form from '../atoms/Form';
import Input from '../atoms/Input';
import Toast from '../atoms/Toast';

const schema = Joi.object<TLoginAuthCredential.Data.Body>({
  email: TLoginAuthCredential.Data.Body.schema.extract('email').label('Email'),
  password: TLoginAuthCredential.Data.Body.schema.extract('password').label('Senha'),
});

function LoginAuthCredentialForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = React.useState(false);
  const [remember, setRemember] = React.useState(false);

  const form = useForm<TLoginAuthCredential.Data.Body>({
    resolver: joiResolver(schema, {messages}),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handler = React.useCallback(
    async (data: TLoginAuthCredential.Data.Body) => {
      try {
        if (remember) {
          localStorage.setItem('remember', btoa(JSON.stringify(data)));
        }
        setLoading(true);
        await authService.loginAuthCredential(data);
        await navigate(searchParams.get('redirect') ?? '/', {replace: true});
      } catch (error: any) {
        Toast.error(Toast.toastProps[error.status] ?? Toast.toastProps[500]);
      } finally {
        setLoading(false);
      }
    },
    [remember, setLoading, navigate, searchParams]
  );

  React.useEffect(() => {
    const base64Value = localStorage.getItem('remember');
    if (!form.formState.isDirty && base64Value) {
      try {
        const stringfied = atob(base64Value);
        const {email, password}: TLoginAuthCredential.Data.Body = JSON.parse(stringfied);
        form.setValue('email', email);
        form.setValue('password', password);
      } catch {
        /** no need catches it */
      }
    }
  }, [form]);

  return (
    <Form onSubmit={form.handleSubmit(handler)} className="flex flex-col">
      <Form.Control error={form.formState.errors.email}>
        <Form.Label>Email</Form.Label>
        <Input className="bg-base-200" placeholder="john.doe@email.com" {...form.register('email')} />
        <Form.Description />
      </Form.Control>

      <Form.Control error={form.formState.errors.password}>
        <Form.Label className="flex flex-row justify-between">
          <span>Senha</span>
          <a href="/recover?otp" className="btn btn-sm btn-link p-0 m-0 h-auto">
            Recuperar senha
          </a>
        </Form.Label>
        <Input.Password className="bg-base-200" placeholder="********" {...form.register('password')} />
        <Form.Description />
      </Form.Control>

      <Form.Control>
        <label
          className={cn(
            'flex items-center pb-2 text-xs font-medium leading-none peer-disabled:cursor-not-allowed',
            'peer-disabled:opacity-70 gap-2'
          )}
        >
          Relembrar-me
          <Input.Checkbox value={Number(remember)} onCheckedChange={setRemember} className="checkbox-xs" />
        </label>
      </Form.Control>

      <Form.Control>
        <Button.Loadable loading={loading} className="btn-primary w-full">
          Entrar
        </Button.Loadable>
      </Form.Control>
    </Form>
  );
}

export default LoginAuthCredentialForm;
