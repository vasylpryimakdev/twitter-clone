import axios from "axios";
import { FirebaseError } from "firebase/app";
import { AppError } from "./AppError";

export const normalizeError = (error: unknown): AppError => {
  if (axios.isAxiosError(error)) {
    return new AppError(
      error.response?.data?.message || "Network error",
      "network",
    );
  }

  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-email":
        return new AppError("Invalid email format", "auth");

      case "auth/user-disabled":
        return new AppError("User account is disabled", "auth");

      case "auth/user-not-found":
        return new AppError("User not found", "auth");

      case "auth/wrong-password":
        return new AppError("Incorrect password", "auth");

      case "auth/invalid-credential":
        return new AppError("Invalid credentials", "auth");

      case "auth/email-already-in-use":
        return new AppError("Email is already in use", "auth");

      case "auth/weak-password":
        return new AppError("Password is too weak", "auth");

      case "auth/too-many-requests":
        return new AppError("Too many attempts. Try again later", "auth");

      case "auth/requires-recent-login":
        return new AppError("Please login again to continue", "auth");

      case "auth/popup-closed-by-user":
        return new AppError("Login popup was closed", "auth");

      case "auth/cancelled-popup-request":
        return new AppError("Popup login cancelled", "auth");

      case "auth/popup-blocked":
        return new AppError("Popup blocked by browser", "auth");

      case "auth/network-request-failed":
        return new AppError("Network error. Check your connection", "network");

      case "auth/account-exists-with-different-credential":
        return new AppError(
          "This account is linked with Google. Please sign in with Google.",
          "auth",
        );

      case "auth/credential-already-in-use":
        return new AppError("Credential already in use", "auth");

      case "auth/internal-error":
        return new AppError("Internal authentication error", "auth");

      case "auth/invalid-api-key":
        return new AppError("Invalid Firebase API key", "auth");

      case "auth/operation-not-allowed":
        return new AppError("Operation not allowed", "auth");

      default:
        return new AppError(error.message, "auth");
    }
  }

  if (error instanceof Error) {
    return new AppError(error.message, "unknown");
  }

  return new AppError("Something went wrong", "unknown");
};
