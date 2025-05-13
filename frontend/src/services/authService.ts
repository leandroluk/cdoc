import {createDomainAxios} from '#/utils';
import {type TLoginAuthCredential, type TOtpAuth, type TRecoverAuth} from '@cdoc/domain';

const axios = createDomainAxios({baseURL: import.meta.env.VITE_BACKEND_API_URL});

const authService = {
  async loginAuthCredential(body: TLoginAuthCredential.Data.Body): Promise<void> {
    await axios.post('/auth/login/credential', body, {withCredentials: true});
  },

  async recoverAuth(body: TRecoverAuth.Data.Body): Promise<void> {
    await axios.post('/auth/recover', body);
  },

  async otpAuth(body: TOtpAuth.Data.Body): Promise<void> {
    await axios.post('/auth/otp', body);
  },
};

export default authService;
