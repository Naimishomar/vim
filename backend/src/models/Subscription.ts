import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  user: mongoose.Types.ObjectId;
  plan: 'monthly' | 'quarterly' | 'yearly';
  status: 'active' | 'expired' | 'cancelled';
  expiresAt: Date;
}

const SubscriptionSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: ['monthly', 'quarterly', 'yearly'], required: true },
  status: { type: String, enum: ['active', 'expired', 'cancelled'], required: true },
  expiresAt: { type: Date, required: true },
}, {
  timestamps: true,
});

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
