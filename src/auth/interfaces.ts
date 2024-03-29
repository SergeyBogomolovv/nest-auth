import { Token } from '@prisma/client';

export interface Tokens {
  accesToken: string;
  refreshToken: Token;
}
