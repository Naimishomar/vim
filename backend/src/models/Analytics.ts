import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalytics extends Document {
  date: Date;
  activeUsers: number;
  dailyUsers: number;
  monthlyUsers: number;
  averageCallDuration: number;
}

const AnalyticsSchema: Schema = new Schema({
  date: { type: Date, required: true, unique: true },
  activeUsers: { type: Number, default: 0 },
  dailyUsers: { type: Number, default: 0 },
  monthlyUsers: { type: Number, default: 0 },
  averageCallDuration: { type: Number, default: 0 },
}, {
  timestamps: true,
});

export default mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
