import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { firebaseAdmin } from "../../config/firebase.config";

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("No authorization header");
    }

    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      throw new UnauthorizedException("No token provided");
    }

    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

      request.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
      };

      return true;
    } catch (err) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
