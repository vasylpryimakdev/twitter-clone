import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase/firebase";
import { useAuthStore } from "../stores/auth.store";
import { api } from "../api/api";

export const useAuthInitializer = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const setStatus = useAuthStore((s) => s.setStatus);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  useEffect(() => {
    setStatus("loading");

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setStatus("unauthenticated");
        setInitialized(true);
        return;
      }

      await firebaseUser.reload();

      const res = await api.get("/users/me");

      setUser({
        ...res.data,
        id: firebaseUser.uid,
        emailVerified: firebaseUser.emailVerified,
      });

      setStatus("authenticated");
      setInitialized(true);
    });

    return unsubscribe;
  }, [setUser, setStatus, setInitialized]);
};
