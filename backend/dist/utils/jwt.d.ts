import mongoose from 'mongoose';
export declare const generateTokens: (userId: mongoose.Types.ObjectId | string) => {
    accessToken: string;
    refreshToken: string;
};
export declare const verifyAccessToken: (token: string) => any;
export declare const verifyRefreshToken: (token: string) => any;
//# sourceMappingURL=jwt.d.ts.map