import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export const generateTokens = (user: any) => {
  const payload = {
    id: user._id.toString(),
    _id: user._id.toString(),
    name: user.name,
    username: user.username,
    email: user.email,
    profileImage: user.profileImage,
    premiumStatus: user.premiumStatus,
    gender: user.gender,
    country: user.country
  };

  const accessToken = jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_ACCESS_EXPIRES_IN as any,
  });

  const refreshToken = jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
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
