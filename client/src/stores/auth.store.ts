import { create } from "zustand";

import type { UserProfile } from "../types/user.types";

type AuthState = {
  user: UserProfile | null;

  isInitialized: boolean;

  setUser: (user: UserProfile | null) => void;

  setInitialized: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  isInitialized: false,

  setUser: (user) => set({ user }),

  setInitialized: (value) => set({ isInitialized: value }),
}));
