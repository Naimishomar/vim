import mongoose, { Document, Schema } from 'mongoose';

export interface IBlock extends Document {
  blocker: mongoose.Types.ObjectId;
  blockedUser: mongoose.Types.ObjectId;
  createdAt: Date;
}

const BlockSchema: Schema = new Schema({
  blocker: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  blockedUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});

export default mongoose.model<IBlock>('Block', BlockSchema);
