import Theme from '#/components/atoms/Theme';
import userService from '#/services/userService';
import {setCookie} from '#/utils';
import {COOKIE_THEME_VALUE, type TUpdateUserProfile} from '@cdoc/domain';
import {create} from 'zustand';

type State = {
  loading: null | keyof Actions;
  user: null | Awaited<ReturnType<typeof userService.getUserWithProfile>>;
  fullName?: string;
  placeholder?: string;
  picture?: string;
};

type Actions = {
  getUserWithProfile: () => Promise<void>;
  updateUserProfile: (profile: TUpdateUserProfile.Data.Body) => Promise<void>;
  uploadUserProfileFile(file: File): Promise<void>;
};

export const userStore = create<State & Actions>((set, get) => ({
  loading: null,
  user: null,
  profile: null,
  picture: undefined,
  placeholder: undefined,
  fullName: undefined,

  async getUserWithProfile() {
    set({loading: 'getUserWithProfile'});
    try {
      let {user} = get();
      if (!user) {
        user = await userService.getUserWithProfile();
        Theme.setDocumentTheme(user.Profile.theme);
        setCookie(COOKIE_THEME_VALUE, user.Profile.theme);
        set({user});
      }
    } finally {
      set({loading: null});
    }
  },

  async updateUserProfile(profile) {
    set({loading: 'updateUserProfile'});
    try {
      await userService.updateUserProfile(profile);
      set({user: await userService.getUserWithProfile()});
    } finally {
      set({loading: null});
    }
  },

  async uploadUserProfileFile(file) {
    set({loading: 'uploadUserProfileFile'});
    try {
      await userService.uploadUserProfileFile(file);
      set({user: await userService.getUserWithProfile()});
    } finally {
      set({loading: null});
    }
  },
}));

export default userStore;
