import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase/firebase";
import { useAuthStore } from "../stores/auth.store";
import { api } from "../api/api";
import { handleError } from "../shared/errors/handleError";
import { useToastStore } from "../stores/toast.store";

export const useAuthInitializer = () => {
  useEffect(() => {
    const showToast = useToastStore.getState().showToast;
    const { setUser, setStatus, setInitialized, setShouldShowWelcome } =
      useAuthStore.getState();

    setStatus("loading");

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const shouldShowWelcome = useAuthStore.getState().shouldShowWelcome;

      try {
        if (!firebaseUser) {
          setUser(null);
          setStatus("unauthenticated");
          setInitialized(true);
          return;
        }

        await firebaseUser.reload();

        const token = await firebaseUser.getIdToken();

        if (!token) {
          setUser(null);
          setStatus("unauthenticated");
          setInitialized(true);

          return;
        }

        const res = await api.get("/users/me");

        setUser({
          ...res.data,
          id: firebaseUser.uid,
          emailVerified: firebaseUser.emailVerified,
        });

        if (shouldShowWelcome) {
          showToast(`Welcome ${res.data.name} 👋`, "success");

          setShouldShowWelcome(false);
        }

        setStatus("authenticated");
      } catch (error) {
        handleError(error);

        setUser(null);
        setStatus("unauthenticated");
      } finally {
        setInitialized(true);
      }
    });

    return unsubscribe;
  }, []);
};
