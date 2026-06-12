import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      throw new UnauthorizedException("No token provided");
    }

    try {
      const decoded = await this.authService.verifyToken(token);

      req.user = {
        id: decoded.uid,
        email: decoded.email,
        emailVerified: decoded.email_verified ?? false,
      };

      return true;
    } catch {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
