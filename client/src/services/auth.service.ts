import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  getAdditionalUserInfo,
  updatePassword,
} from "firebase/auth";

import { auth } from "../firebase/firebase";
import { usersService } from "./users.service";
import { AUTH_ERRORS } from "../constants/errors";

export const authService = {
  async signUp(email: string, password: string) {
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await sendEmailVerification(credential.user);
      return credential;
    } catch {
      throw new Error(AUTH_ERRORS.MAIL_ALREADY_IN_USE);
    }
  },

  async signInWithGoogle() {
    const googleProvider = new GoogleAuthProvider();

    googleProvider.setCustomParameters({
      prompt: "select_account",
    });

    const result = await signInWithPopup(auth, googleProvider);

    const isNewUser = getAdditionalUserInfo(result)?.isNewUser;

    if (!isNewUser) {
      await signOut(auth);

      throw new Error(AUTH_ERRORS.GOOGLE_ALREADY_REGISTERED);
    }

    return result;
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

  async sendVerificationEmail() {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No authenticated user");
    }

    if (user.emailVerified) {
      return;
    }

    return sendEmailVerification(user);
  },

  async changePassword(oldPassword: string, newPassword: string) {
    const user = auth.currentUser;

    if (!user || !user.email) {
      throw new Error("No authenticated user");
    }

    const credential = EmailAuthProvider.credential(user.email, oldPassword);

    await reauthenticateWithCredential(user, credential);

    await updatePassword(user, newPassword);
    await signInWithEmailAndPassword(auth, user.email!, newPassword);
  },

  async sendPasswordReset(email: string) {
    if (!email) {
      throw new Error("Email is required");
    }

    return sendPasswordResetEmail(auth, email);
  },
};
