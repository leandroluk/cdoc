import userStore from '#/stores/userStore';
import {TUpdateUserProfile} from '@cdoc/domain';
import {joiResolver} from '@hookform/resolvers/joi';
import Joi from 'joi';
import {messages} from 'joi-translation-pt-br';
import React from 'react';
import {useForm} from 'react-hook-form';
import Button from '../atoms/Button';
import Form from '../atoms/Form';
import Input from '../atoms/Input';
import Theme from '../atoms/Theme';
import Toast from '../atoms/Toast';

type Schema = Pick<TUpdateUserProfile.Data.Body, 'givenName' | 'familyName' | 'theme'>;

const schema = Joi.object<Schema>({
  givenName: TUpdateUserProfile.Data.Body.schema.extract('givenName').label('Nome'),
  familyName: TUpdateUserProfile.Data.Body.schema.extract('familyName').label('Sobrenome'),
  theme: TUpdateUserProfile.Data.Body.schema.extract('theme').label('Tema'),
});

function ProfileForm() {
  const user = userStore(_ => _.user);
  const [loading, setLoading] = React.useState(false);
  const userState = userStore();

  const form = useForm<Schema>({
    resolver: joiResolver(schema, {messages}),
    mode: 'onChange',
    defaultValues: {
      givenName: user?.Profile.givenName,
      familyName: user?.Profile.familyName,
      theme: user?.Profile.theme,
    },
  });

  const handler = React.useCallback(
    async (data: Schema) => {
      try {
        setLoading(true);
        await userState.updateUserProfile(data);
      } catch (error: any) {
        Toast.error(Toast.toastProps[error.status ?? 500]);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, userState]
  );

  return (
    <Form onSubmit={form.handleSubmit(handler)}>
      <Form.Control error={form.formState.errors.givenName}>
        <Form.Label>Nome</Form.Label>
        <Input {...form.register('givenName')} />
      </Form.Control>

      <Form.Control error={form.formState.errors.familyName}>
        <Form.Label>Sobrenome</Form.Label>
        <Input {...form.register('familyName')} />
      </Form.Control>

      <Form.Control error={form.formState.errors.theme}>
        <Form.Label>Tema</Form.Label>
        <Theme.Toggle
          className="flex w-full"
          btnClassName="flex-1"
          initialValue={user?.Profile.theme}
          onChange={theme => form.setValue('theme', theme, {shouldDirty: true, shouldValidate: true})}
        />
      </Form.Control>

      <Form.Control>
        <Button.Loadable className="btn-primary" loading={loading} disabled={loading || !form.formState.isDirty}>
          Salvar
        </Button.Loadable>
      </Form.Control>
    </Form>
  );
}

export default ProfileForm;
