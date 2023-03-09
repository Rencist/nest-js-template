import { Request } from 'express';
export interface TokenBearerInterface extends Request {
  headers: {
    authorization: string;
  };
}
