import mongoose, { Document, Schema } from 'mongoose';

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

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  googleId: { type: String, sparse: true },
  facebookId: { type: String, sparse: true },
  githubId: { type: String, sparse: true },
  appleId: { type: String, sparse: true },
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  country: { type: String },
  profileImage: { type: String },
  interests: [{ type: String }],
  premiumStatus: { type: Boolean, default: false },
  premiumExpiryDate: { type: Date },
  blockedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  chatsThisWeek: { type: Number, default: 0 },
  lastChatResetDate: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

export default mongoose.model<IUser>('User', UserSchema);
