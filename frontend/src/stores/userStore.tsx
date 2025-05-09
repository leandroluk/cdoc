import userService from '#/services/userService';
import {setCookie} from '#/utils';
import {COOKIE_THEME_VALUE, type TProfile, type TUpdateUserProfile} from '@cdoc/domain';
import {create} from 'zustand';

type State = {
  loading: null | keyof Actions;
  profile: null | TProfile;
};

type Actions = {
  getProfile: () => Promise<void>;
  updateUserProfile: (profile: TUpdateUserProfile.Data.Body) => Promise<void>;
};

export const userStore = create<State & Actions>((set, get) => ({
  loading: null,
  profile: null,

  async getProfile() {
    set({loading: 'getProfile'});
    try {
      let {profile} = get();
      if (!profile) {
        profile = await userService.getUserProfile();
        setCookie(COOKIE_THEME_VALUE, profile.theme);
        set({profile});
      }
    } finally {
      set({loading: null});
    }
  },

  async updateUserProfile(profile) {
    set({loading: 'updateUserProfile'});
    try {
      await userService.updateUserProfile(profile);
      set({profile: await userService.getUserProfile()});
    } finally {
      set({loading: null});
    }
  },
}));

export default userStore;
