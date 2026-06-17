import { create } from "zustand";
import type { UserProfile } from "../types/user.types";

type AuthState = {
  user: UserProfile | null;
  status: "loading" | "authenticated" | "unauthenticated";

  setUser: (user: UserProfile | null) => void;
  setStatus: (s: AuthState["status"]) => void;

  reset: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "loading",

  setUser: (user) =>
    set({
      user,
      status: user ? "authenticated" : "unauthenticated",
    }),

  setStatus: (status) => set({ status }),

  reset: () =>
    set({
      user: null,
      status: "unauthenticated",
    }),
}));
