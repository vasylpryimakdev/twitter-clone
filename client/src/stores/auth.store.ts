import { create } from "zustand";
import type { UserProfile } from "../types/user.types";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthState = {
  user: UserProfile | null;
  status: AuthStatus;
  isInitialized: boolean;

  setUser: (u: Partial<UserProfile> | null) => void;
  setStatus: (s: AuthStatus) => void;
  setInitialized: (v: boolean) => void;

  reset: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "loading",
  isInitialized: false,

  setUser: (updateData) => {
    set((state) => {
      if (!updateData) {
        return { user: null };
      }

      return {
        user: state.user
          ? { ...state.user, ...updateData }
          : (updateData as UserProfile),
      };
    });
  },

  setStatus: (status) => set({ status }),

  setInitialized: (v) => set({ isInitialized: v }),

  reset: () =>
    set({
      user: null,
      status: "unauthenticated",
      isInitialized: false,
    }),
}));
