import {type TLoginAuthCredential, type TOtpAuth, type TRecoverAuth} from '@cdoc/domain';
import Axios from 'axios';

const axios = Axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: true,
});

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
