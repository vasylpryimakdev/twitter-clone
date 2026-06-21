import {
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: any, res: any, next: () => void) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        req.user = null;
        return next();
      }

      const token = authHeader.split("Bearer ")[1];

      if (!token) {
        req.user = null;
        return next();
      }

      const decoded = await this.authService.verifyToken(token);

      req.user = {
        id: decoded.uid,
        email: decoded.email,
      };
    } catch (e) {
      req.user = null;
    }

    next();
  }
}
