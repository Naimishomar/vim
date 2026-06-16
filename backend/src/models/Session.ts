import mongoose, { Document, Schema } from 'mongoose';

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

const SessionSchema: Schema = new Schema({
  roomId: { type: String, required: true, unique: true },
  user1: { type: String, required: true },
  user2: { type: String, required: true },
  callType: { type: String, enum: ['video', 'audio', 'chat'], required: true },
  quality: { type: String, default: '480p' },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  duration: { type: Number },
});

export default mongoose.model<ISession>('Session', SessionSchema);
