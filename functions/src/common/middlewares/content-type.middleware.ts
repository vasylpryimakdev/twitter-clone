import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from "@nestjs/common";

import type { Request, Response, NextFunction } from "express";

@Injectable()
export class ContentTypeMiddleware implements NestMiddleware {
  private readonly methods = new Set(["POST", "PUT", "PATCH"]);

  private readonly allowedContentTypes = [
    "application/json",
    "multipart/form-data",
  ];

  use(req: Request, _: Response, next: NextFunction): void {
    if (!this.methods.has(req.method)) {
      return next();
    }

    const contentType = req.headers["content-type"];

    if (!contentType) {
      throw new BadRequestException("Content-Type header is required");
    }

    const isAllowed = this.allowedContentTypes.some((type) =>
      contentType.includes(type),
    );

    if (!isAllowed) {
      throw new BadRequestException(
        `Unsupported Content-Type. Allowed: ${this.allowedContentTypes.join(", ")}`,
      );
    }

    next();
  }
}
