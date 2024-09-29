import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new ForbiddenException('No token provided');
    }

    const payload = await this.authService.verifyToken(token);
    if (!payload || !payload.isAdmin) { // Assuming you have an isAdmin field in the token payload
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
