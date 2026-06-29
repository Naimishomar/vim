import mongoose, { Document } from 'mongoose';
export interface IGroup extends Document {
    roomId: string;
    name: string;
    description: string;
    photo: string;
    adminId: mongoose.Types.ObjectId;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IGroup, {}, {}, {}, mongoose.Document<unknown, {}, IGroup, {}, mongoose.DefaultSchemaOptions> & IGroup & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IGroup>;
export default _default;
//# sourceMappingURL=Group.d.ts.map