import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ForbiddenException } from 'src/exceptions/exception';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-api-key'] ?? null;
    if (!token) throw new ForbiddenException();
    return this.validateToken(token);
  }

  validateToken(token: string) {
    try {
      if (process.env.API_KEY === token) {
        return true;
      }
      throw new ForbiddenException();
    } catch {
      throw new ForbiddenException();
    }
  }
}
