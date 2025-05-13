import {createDomainAxios, dedupe} from '#/utils';
import {type TGetUserWithProfile, type TUpdateUserProfile} from '@cdoc/domain';

const axios = createDomainAxios({baseURL: import.meta.env.VITE_BACKEND_API_URL});

const userService = {
  getUserWithProfile: async (): Promise<
    Omit<TGetUserWithProfile.Result, 'Profile'> & {
      Profile: Omit<TGetUserWithProfile.Result['Profile'], 'picture'> & {
        fullName: string;
        avatarPlaceholder: string;
        avatarPicture?: string;
      };
    }
  > => {
    return dedupe('getUserWithProfile', async () => {
      const {data} = await axios.get<TGetUserWithProfile.Result>('/user/profile');
      const fullName = [data.Profile.givenName, data.Profile.familyName].filter(Boolean).join(' ');

      let avatarPlaceholder: string = [data.Profile.givenName, data.Profile.familyName]
        .filter(Boolean)
        .map(word => word![0])
        .join('')
        .toUpperCase();
      avatarPlaceholder ??= data.email[0].toUpperCase();

      let avatarPicture: string | undefined;
      if (data.Profile.picture) {
        avatarPicture = `${import.meta.env.VITE_BACKEND_API_URL}/user/picture?t=${Date.now()}`;
      }
      return {
        ...data,
        Profile: {
          ...data.Profile,
          fullName,
          avatarPlaceholder,
          avatarPicture,
        },
      };
    });
  },
  async logoffUser(): Promise<void> {
    await axios.post('/user/logoff');
  },
  async updateUserProfile(body: TUpdateUserProfile.Data.Body): Promise<void> {
    await axios.post('/user/profile', body);
  },
  async uploadUserProfileFile(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    await axios.post('/user/profile/_upload/picture', formData);
  },
};

export default userService;
