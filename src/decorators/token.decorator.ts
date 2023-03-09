import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { decode } from 'jsonwebtoken';
import { TokenBearerInterface } from '../dto/jwt/token.dto';

export const Token = createParamDecorator(
  async (data: string, ctx: ExecutionContext) => {
    const request: TokenBearerInterface = ctx.switchToHttp().getRequest();
    const token = request.headers?.authorization ?? null;

    if (!token) throw new UnauthorizedException('No Token');

    if (token.split(' ').length < 2)
      throw new UnauthorizedException('Invalid Token');

    const bearerToken = token.split(' ')[1];
    const decoded = decode(bearerToken, { json: true });

    return data ? decoded?.[data] : false;
  },
);
