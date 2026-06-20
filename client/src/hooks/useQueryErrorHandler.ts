import { useEffect } from "react";
import { handleError } from "../shared/errors/handleError";

export const useQueryErrorHandler = (error: unknown, isError: boolean) => {
  useEffect(() => {
    if (isError && error) {
      handleError(error);
    }
  }, [isError, error]);
};
