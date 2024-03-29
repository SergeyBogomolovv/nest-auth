import { Token, UserRole } from '@prisma/client';

export interface Tokens {
  accesToken: string;
  refreshToken: Token;
}
export interface JwtPayload {
  id: string;
  email: string;
  roles: UserRole;
}
