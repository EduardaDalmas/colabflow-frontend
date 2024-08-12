import { create } from 'zustand';

type ProfileStateModel = {
  user: string | null;
  isLoggedIn: boolean | null;
  setUser: (params: string | null) => void;
  setLoggedIn: (params: boolean) => void;
  clearProfile: () => void;
};

const initialState = {
  user: null,
  isLoggedIn: null,
};

export const useProfileStore = create<ProfileStateModel>((set) => ({
  ...initialState,

  setUser: (user) => {
    set({ user });
  },
  setLoggedIn: (isLoggedIn) => {
    set({ isLoggedIn });
  },

  clearProfile: () => set(initialState),
}));
