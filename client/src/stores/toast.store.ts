import { create } from "zustand";

type ToastType = "success" | "error" | "info";

type ToastState = {
  message: string | null;
  type: ToastType;
  open: boolean;

  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
};

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  type: "success",
  open: false,

  showToast: (message, type = "success") =>
    set({
      message,
      type,
      open: true,
    }),

  hideToast: () =>
    set({
      open: false,
      message: null,
    }),
}));
