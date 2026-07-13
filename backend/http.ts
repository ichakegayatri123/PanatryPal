import { NextFunction, Request, Response } from 'express';

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) { super(message); }
}

export const asyncHandler = (handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => void handler(req, res, next).catch(next);

export function requiredString(value: unknown, field: string, maxLength = 200): string {
  if (typeof value !== 'string' || !value.trim()) throw new ApiError(400, `${field} is required`);
  const result = value.trim();
  if (result.length > maxLength) throw new ApiError(400, `${field} must be at most ${maxLength} characters`);
  return result;
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  const known = error instanceof ApiError;
  if (!known) console.error('Unhandled API error:', error);
  res.status(known ? error.statusCode : 500).json({ error: known ? error.message : 'An unexpected server error occurred' });
}
