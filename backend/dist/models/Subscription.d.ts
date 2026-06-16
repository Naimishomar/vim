import mongoose, { Document } from 'mongoose';
export interface ISubscription extends Document {
    user: mongoose.Types.ObjectId;
    plan: 'monthly' | 'quarterly' | 'yearly';
    status: 'active' | 'expired' | 'cancelled';
    expiresAt: Date;
}
declare const _default: mongoose.Model<ISubscription, {}, {}, {}, mongoose.Document<unknown, {}, ISubscription, {}, mongoose.DefaultSchemaOptions> & ISubscription & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISubscription>;
export default _default;
//# sourceMappingURL=Subscription.d.ts.map