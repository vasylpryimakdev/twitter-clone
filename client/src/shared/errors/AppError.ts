import type { AppErrorType } from "./types";

export class AppError extends Error {
  type: AppErrorType;

  constructor(message: string, type: AppErrorType = "unknown") {
    super(message);
    this.type = type;
  }
}
