import { api } from "../api/api";
import type { UpdateUserDto, UserProfile } from "../types/user.types";

export const usersService = {
  getMe: async (): Promise<UserProfile> => {
    const res = await api.get("/users/me");
    return res.data;
  },

  createProfile: async (data: {
    name: string;
    surname: string;
    username: string;
    avatar?: {
      url: string;
      path?: string;
      type: "google" | "upload";
    } | null;
  }) => {
    const res = await api.post("/users/me", data);

    return res.data;
  },

  updateProfile: async (data: UpdateUserDto) => {
    const res = await api.patch("/users/me", data);

    return res.data;
  },

  deleteProfile: async () => {
    const res = await api.delete("/users/me");
    return res.data;
  },
};
