import { api } from "../api/api";

export const usersService = {
  createProfile: async (data: {
    firstName: string;
    lastName: string;
    username: string;
  }) => {
    const res = await api.post("/users", data);
    return res.data;
  },
};
