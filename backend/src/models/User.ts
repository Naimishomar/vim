import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  username: string;
  email?: string;
  age?: number;
  gender?: string;
  country?: string;
  profileImage?: string;
  interests: string[];
  premiumStatus: boolean;
  coins: number;
  blockedUsers: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  country: { type: String },
  profileImage: { type: String },
  interests: [{ type: String }],
  premiumStatus: { type: Boolean, default: false },
  coins: { type: Number, default: 0 },
  blockedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: true,
});

export default mongoose.model<IUser>('User', UserSchema);
