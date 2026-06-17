import { api } from "../api/api";

export const usersService = {
  createProfile: async (data: {
    name: string;
    surname: string;
    username: string;
  }) => {
    const res = await api.post("/users/me", data);

    return res.data;
  },
};
