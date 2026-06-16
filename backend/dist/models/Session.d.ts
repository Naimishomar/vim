import mongoose, { Document } from 'mongoose';
export interface ISession extends Document {
    roomId: string;
    user1: string;
    user2: string;
    callType: 'video' | 'audio' | 'chat';
    quality: string;
    startedAt: Date;
    endedAt?: Date;
    duration?: number;
}
declare const _default: mongoose.Model<ISession, {}, {}, {}, mongoose.Document<unknown, {}, ISession, {}, mongoose.DefaultSchemaOptions> & ISession & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISession>;
export default _default;
//# sourceMappingURL=Session.d.ts.map