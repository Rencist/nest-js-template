import { Injectable } from '@nestjs/common';
import { sign, decode } from 'jsonwebtoken';
import { ForbiddenException } from '../../exceptions/exception';

@Injectable()
export class JwtService {
  async validate(token: string) {
    if (!token) throw new ForbiddenException();

    if (token.split(' ').length < 2) throw new ForbiddenException();
  }

  async decode(token: string) {
    this.validate(token);

    const bearerToken = token.split(' ')[1];
    const decoded = decode(bearerToken, { json: true });
    return decoded;
  }

  async create(payload: object): Promise<string> {
    const token = sign(payload, process.env.SECRET_JWT, {
      expiresIn: '1h',
    });
    return token;
  }
}
