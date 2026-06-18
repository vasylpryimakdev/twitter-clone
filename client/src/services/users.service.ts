import { api } from "../api/api";
import type { ProfileEditForm } from "../schemas/profileEdit.schema";

export const usersService = {
  createProfile: async (data: {
    name: string;
    surname: string;
    username: string;
  }) => {
    const res = await api.post("/users/me", data);

    return res.data;
  },

  updateProfile: async (data: ProfileEditForm) => {
    const res = await api.patch("/users/me", data);

    return res.data;
  },

  deleteProfile: async () => {
    const res = await api.delete("/users/me");
    return res.data;
  },
};
