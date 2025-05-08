import {type TLoginAuthCredential} from '@cdoc/domain';
import axios from 'axios';

const authService = {
  async loginAuthCredential(data: TLoginAuthCredential.Data): Promise<void> {
    try {
      const url = `${import.meta.env.VITE_BACKEND_API_URL}/auth/login/credential`;
      await axios.post(url, data.body, {withCredentials: true});
    } catch (error) {
      console.log(error);
    }
  },
};

export default authService;
