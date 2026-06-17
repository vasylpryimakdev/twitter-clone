import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase/firebase";
import { useAuthStore } from "../stores/auth.store";
import { api } from "../api/api";

export const useAuthInitializer = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const setStatus = useAuthStore((s) => s.setStatus);

  useEffect(() => {
    setStatus("loading");

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          setStatus("unauthenticated");
          return;
        }

        const res = await api.get("/users/me");

        setUser(res.data);
        setStatus("authenticated");
      } catch (e) {
        console.error("AUTH INIT ERROR:", e);

        setUser(null);
        setStatus("unauthenticated");
      }
    });

    return unsubscribe;
  }, [setUser, setStatus]);
};
