import jwt, { SignOptions } from 'jsonwebtoken';

export type TJwtPayload = {
  userId: string;
  email: string;
  role: string;
};

export const generateAccessToken = (payload: TJwtPayload): string => {
  const secret = process.env.JWT_ACCESS_SECRET as string;
  const expiresIn = (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as SignOptions['expiresIn'];
  return jwt.sign(payload, secret, { expiresIn });
};

export const generateRefreshToken = (payload: TJwtPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET as string;
  const expiresIn = (process.env.JWT_REFRESH_EXPIRES_IN || '30d') as SignOptions['expiresIn'];
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyAccessToken = (token: string): TJwtPayload => {
  const secret = process.env.JWT_ACCESS_SECRET as string;
  return jwt.verify(token, secret) as TJwtPayload;
};

export const verifyRefreshToken = (token: string): TJwtPayload => {
  const secret = process.env.JWT_REFRESH_SECRET as string;
  return jwt.verify(token, secret) as TJwtPayload;
};
