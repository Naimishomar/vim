import mongoose, { Document } from 'mongoose';
export interface IBlock extends Document {
    blocker: mongoose.Types.ObjectId;
    blockedUser: mongoose.Types.ObjectId;
    createdAt: Date;
}
declare const _default: mongoose.Model<IBlock, {}, {}, {}, mongoose.Document<unknown, {}, IBlock, {}, mongoose.DefaultSchemaOptions> & IBlock & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IBlock>;
export default _default;
//# sourceMappingURL=Block.d.ts.map