import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    name: string;
    username: string;
    email?: string;
    googleId?: string;
    facebookId?: string;
    githubId?: string;
    appleId?: string;
    age?: number;
    gender?: string;
    country?: string;
    profileImage?: string;
    interests: string[];
    premiumStatus: boolean;
    premiumExpiryDate?: Date;
    blockedUsers: mongoose.Types.ObjectId[];
    chatsThisWeek: number;
    lastChatResetDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
export default _default;
//# sourceMappingURL=User.d.ts.map