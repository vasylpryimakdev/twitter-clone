import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from "@nestjs/common";

import type { NextFunction, Request, Response } from "express";

@Injectable()
export class ContentTypeMiddleware implements NestMiddleware {
  private static readonly SUPPORTED_METHODS = ["POST", "PUT", "PATCH"] as const;

  private static readonly SUPPORTED_CONTENT_TYPE = "application/json";

  use(req: Request, _: Response, next: NextFunction): void {
    if (
      !ContentTypeMiddleware.SUPPORTED_METHODS.includes(
        req.method as (typeof ContentTypeMiddleware.SUPPORTED_METHODS)[number],
      )
    ) {
      return next();
    }

    const contentType = req.headers["content-type"]?.toString();

    if (!contentType) {
      throw new BadRequestException("Content-Type header is required");
    }

    const normalizedContentType = contentType.split(";")[0].trim();

    if (
      normalizedContentType !== ContentTypeMiddleware.SUPPORTED_CONTENT_TYPE
    ) {
      throw new BadRequestException({
        message: "Unsupported Content-Type",
        expected: ContentTypeMiddleware.SUPPORTED_CONTENT_TYPE,
        received: contentType,
      });
    }

    next();
  }
}
