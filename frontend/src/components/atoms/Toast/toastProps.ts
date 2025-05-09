import deepmerge from 'deepmerge';
import {type ToastItem} from './useToastStore';

const statusMap = {
  200: 'Ok',
  204: 'Sem conteúdo',
  400: 'Requisição inválida',
  401: 'Não autorizado',
  404: 'Não encontrado',
  406: 'Não aceito',
  500: 'Erro interno',
};

const toastProps = deepmerge<Record<keyof typeof statusMap, ToastItem> & Record<any, ToastItem>>(
  Object.entries(statusMap).reduce((obj, [key, title]) => ({...obj, [key]: {title}}), {}),
  {
    400: {description: 'Verifique se os dados enviados são válidos'},
    401: {description: 'Credenciais inválidas'},
    500: {description: 'Entre em contato com o suporte'},
  } as unknown as Record<any, ToastItem>
);

export default toastProps;
