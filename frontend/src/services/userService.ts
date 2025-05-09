import {dedupe} from '#/utils';
import {type TGetUserProfile, type TUpdateUserProfile} from '@cdoc/domain';
import Axios from 'axios';

const axios = Axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: true,
});

const userService = {
  async getUserProfile(): Promise<TGetUserProfile.Result> {
    return dedupe('getUserProfile', async () => {
      const {data} = await axios.get<TGetUserProfile.Result>('/user/profile');
      return data;
    });
  },
  async logoffUser(): Promise<void> {
    await axios.post('/user/logoff');
  },
  async updateUserProfile(body: TUpdateUserProfile.Data.Body): Promise<void> {
    await axios.post('/user/profile', body);
  },
};

export default userService;
