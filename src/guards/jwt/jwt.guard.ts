import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { decode, verify } from 'jsonwebtoken';
import { ForbiddenException } from 'src/exceptions/exception';
@Injectable()
export class JwtGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization ?? null;
    if (!token) throw new ForbiddenException();
    if (token.split(' ').length < 2) throw new ForbiddenException();

    const bearerToken = token.split(' ')[1];

    return this.validateToken(bearerToken);
  }

  validateToken(token: string) {
    try {
      const isValid = verify(token, process.env.SECRET_JWT);
      if (!isValid) throw new ForbiddenException();
      const decodeToken = decode(token, { json: true });

      if (!decodeToken.uid) throw new ForbiddenException();
      return true;
    } catch {
      throw new ForbiddenException();
    }
  }
}
