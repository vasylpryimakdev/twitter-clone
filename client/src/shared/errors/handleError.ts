import { useToastStore } from "../../stores/toast.store";
import { normalizeError } from "./normalizeError";

export const handleError = (error: unknown) => {
  const showToast = useToastStore.getState().showToast;

  const appError = normalizeError(error);

  showToast(appError.message, "error");

  console.error(appError);
};
