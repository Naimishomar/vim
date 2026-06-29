import mongoose from 'mongoose';
export interface IBlog extends mongoose.Document {
    slug: string;
    title: string;
    description: string;
    content: string;
    author: string;
    date: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Blog: mongoose.Model<IBlog, {}, {}, {}, mongoose.Document<unknown, {}, IBlog, {}, mongoose.DefaultSchemaOptions> & IBlog & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IBlog>;
//# sourceMappingURL=Blog.d.ts.map