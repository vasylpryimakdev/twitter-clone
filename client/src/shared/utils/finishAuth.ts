import type { NavigateFunction } from "react-router-dom";
import { useToastStore } from "../../stores/toast.store";

export const finishAuth = (message: string, navigate: NavigateFunction) => {
  useToastStore.getState().showToast(message, "success");
  navigate("/", { replace: true });
};
