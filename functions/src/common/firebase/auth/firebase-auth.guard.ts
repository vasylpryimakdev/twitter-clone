import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "./auth.service";
import { IS_PUBLIC_KEY } from "../../../decorators/public.decorator";

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization?.replace("Bearer ", "");

    if (isPublic) {
      if (!token) {
        return true;
      }

      try {
        const decoded = await this.authService.verifyIdToken(token);

        request.user = {
          id: decoded.uid,
          email: decoded.email,
        };
      } catch {}

      return true;
    }

    if (!token) {
      throw new UnauthorizedException("Missing token");
    }

    try {
      const decoded = await this.authService.verifyIdToken(token);

      request.user = {
        id: decoded.uid,
        email: decoded.email,
      };

      return true;
    } catch {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
