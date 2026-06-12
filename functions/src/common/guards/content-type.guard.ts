import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from "@nestjs/common";

@Injectable()
export class ContentTypeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const method = req.method;

    if (method === "GET" || method === "DELETE") {
      return true;
    }

    const contentType = req.headers["content-type"];

    if (!contentType) {
      return true;
    }

    if (!contentType.includes("application/json")) {
      throw new BadRequestException("Only application/json allowed");
    }

    return true;
  }
}
