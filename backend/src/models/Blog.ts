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

const blogSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
      default: 'Vibelly Team',
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Blog = mongoose.model<IBlog>('Blog', blogSchema);
