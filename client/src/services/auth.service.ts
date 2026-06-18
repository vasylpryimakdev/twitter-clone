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
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: "select_account",
    });

    return signInWithPopup(auth, provider);
  },

  login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  },

  logout() {
    return signOut(auth);
  },

  async deleteAccount(password: string) {
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

  async reauthenticate(password: string) {
    const user = auth.currentUser;

    if (!user || !user.email) {
      throw new Error("No authenticated email user");
    }

    const credential = EmailAuthProvider.credential(user.email, password);

    return reauthenticateWithCredential(user, credential);
  },
};
