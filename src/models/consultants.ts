import mongoose from 'mongoose';
import moment from 'moment';

export interface IConsultant extends mongoose.Document {
  _id: string;
  name: string;
  firstName: string;
  slug: string;
  type: string;
  email: string;
  telephone: string;
  createdOn?: moment.Moment;
  active: boolean;
}

const consultantSchema = new mongoose.Schema({
  name: String,
  firstName: String,
  type: String,
  slug: String,
  email: String,
  telephone: String,
  createdOn: Date,
  active: Boolean,
}, {timestamps: {createdAt: 'createdOn'}});

export const ConsultantsCollection = mongoose.model<IConsultant>('consultant', consultantSchema, 'consultants');
