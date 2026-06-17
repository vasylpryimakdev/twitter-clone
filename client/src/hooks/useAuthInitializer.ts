import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase/firebase";
import { useAuthStore } from "../stores/auth.store";
import { api } from "../api/api";

export const useAuthInitializer = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const setStatus = useAuthStore((s) => s.setStatus);
  const setInitialized = useAuthStore((s) => s.setInitialized);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    setStatus("loading");

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setStatus("unauthenticated");
        setInitialized(true);
        return;
      }

      if (user) {
        setStatus("authenticated");

        return;
      }

      try {
        const res = await api.get("/users/me");

        setUser(res.data);
        setStatus("authenticated");
      } catch (e) {
        console.warn("Profile not loaded yet:", e);
        setUser(null);
        setStatus("unauthenticated");
      } finally {
        setInitialized(true);
      }
    });

    return unsubscribe;
  }, [setUser, user, setStatus, setInitialized]);
};
