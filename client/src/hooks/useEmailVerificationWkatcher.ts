import { useEffect } from "react";
import { auth } from "../firebase/firebase";
import { useAuthStore } from "../stores/auth.store";

export const useEmailVerificationWatcher = () => {
  const currentUser = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const interval = setInterval(async () => {
      const user = auth.currentUser;

      if (!user) return;

      await user.reload();

      if (user.emailVerified) {
        if (!currentUser) return;

        setUser({
          ...currentUser,
          emailVerified: true,
        });

        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [setUser, currentUser]);
};
