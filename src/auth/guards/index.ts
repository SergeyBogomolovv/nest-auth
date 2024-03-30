import { JwtAuthGuard } from './jwt-auth.guard';
import { UserOptionsGuard } from './user-options.guard';

export const GUARDS = [JwtAuthGuard, UserOptionsGuard];
