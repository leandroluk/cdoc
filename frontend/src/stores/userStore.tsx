import userService from '#/services/userService';
import {type TProfile, type TUpdateUserProfile} from '@cdoc/domain';
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
      const {profile} = get();
      if (!profile) {
        set({profile: await userService.getUserProfile()});
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
