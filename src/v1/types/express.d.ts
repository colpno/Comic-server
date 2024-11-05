import { JWTPayload } from './common.type';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      originalParams?: Record<string, unknown>;
      originalQuery?: Record<string, unknown>;
      originalBody?: Record<string, unknown>;
    }
  }
}
