import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import mongoose from 'mongoose';

export const generateTokens = (userId: mongoose.Types.ObjectId | string) => {
  const accessToken = jwt.sign({ id: userId.toString() }, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_ACCESS_EXPIRES_IN as any,
  });

  const refreshToken = jwt.sign({ id: userId.toString() }, ENV.JWT_REFRESH_SECRET, {
    expiresIn: ENV.JWT_REFRESH_EXPIRES_IN as any,
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): any => {
  return jwt.verify(token, ENV.JWT_SECRET);
};

export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, ENV.JWT_REFRESH_SECRET);
};
