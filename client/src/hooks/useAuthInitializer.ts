import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase/firebase";
import { useAuthStore } from "../stores/auth.store";
import { api } from "../api/api";

export const useAuthInitializer = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setInitialized(true);
        return;
      }

      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch (e) {
        console.log("INIT ERROR:", e);
      } finally {
        setInitialized(true);
      }
    });

    return unsubscribe;
  }, [setUser, setInitialized]);
};
