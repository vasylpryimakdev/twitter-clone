import { auth } from "./firebase";

export const getToken = async () => {
  const user = auth.currentUser;

  if (!user) return null;

  return await user.getIdToken();
};
