import type { User } from "firebase/auth";

export const createGoogleProfile = (user: User) => {
  const displayName = user.displayName?.trim() || "";
  const email = user.email || "";

  const [name = "", surname = ""] = displayName.split(" ");

  const base = displayName || email.split("@")[0] || "user";

  const cleanBase = base
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9_]/g, "");

  const username = `${cleanBase || "user"}_${user.uid
    .slice(0, 6)
    .toLowerCase()}`;

  return {
    name,
    surname,
    username,
    avatar: user.photoURL
      ? {
          url: user.photoURL,
          type: "google" as const,
        }
      : null,
  };
};
