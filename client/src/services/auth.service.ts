import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase/firebase";
import { usersService } from "./users.service";

export const authService = {
  async signUp(email: string, password: string) {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    await sendEmailVerification(credential.user);

    return credential;
  },

  signInWithGoogle() {
    const googleProvider = new GoogleAuthProvider();

    googleProvider.setCustomParameters({
      prompt: "select_account",
    });

    return signInWithPopup(auth, googleProvider);
  },

  login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  },

  loginWithGoogle: async () => {
    const googleProvider = new GoogleAuthProvider();

    googleProvider.setCustomParameters({
      prompt: "select_account",
    });

    return signInWithPopup(auth, googleProvider);
  },

  logout() {
    return signOut(auth);
  },

  async deleteAccount(password?: string) {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No authenticated user");
    }

    if (user.email && password) {
      const credential = EmailAuthProvider.credential(user.email, password);

      await reauthenticateWithCredential(user, credential);
    }

    await usersService.deleteProfile();

    await deleteUser(user);
  },

  async sendEmailVerification() {
    const user = auth.currentUser;

    if (!user) {
      return;
    }

    return await sendEmailVerification(user);
  },
};
