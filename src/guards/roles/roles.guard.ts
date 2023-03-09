import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';
import { Reflector } from '@nestjs/core';
import { Role, User } from '@prisma/client';
import { ROLES_KEY } from '../../decorators/role.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { TokenBearerInterface } from '../../dto/jwt/token.dto';
import { decode, verify } from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request: TokenBearerInterface = context.switchToHttp().getRequest();

    const token = request.headers?.authorization ?? null;

    const bearerToken = token.split(' ')[1];
    const verified = verify(bearerToken, process.env.SECRET_JWT);
    const decoded = decode(bearerToken, { json: true });

    const User = await this.prisma.user.findUnique({
      where: {
        id: decoded.uid,
      },
    });

    return requiredRoles.some((role) => User.role.includes(role));
  }
}
