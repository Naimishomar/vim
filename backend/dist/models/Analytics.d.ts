import mongoose, { Document } from 'mongoose';
export interface IAnalytics extends Document {
    date: Date;
    activeUsers: number;
    dailyUsers: number;
    monthlyUsers: number;
    averageCallDuration: number;
}
declare const _default: mongoose.Model<IAnalytics, {}, {}, {}, mongoose.Document<unknown, {}, IAnalytics, {}, mongoose.DefaultSchemaOptions> & IAnalytics & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAnalytics>;
export default _default;
//# sourceMappingURL=Analytics.d.ts.map