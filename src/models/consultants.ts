import mongoose from 'mongoose';

export interface IConsultant extends mongoose.Document {
  _id: string;
  name: string;
  firstName: string;
  type: string;
  email: string;
  telephone: string;
  createdOn?: string;
}

const consultantSchema = new mongoose.Schema({
  _id: String,
  name: String,
  firstName: String,
  type: String,
  email: String,
  telephone: String,
  createdOn: String,
});

export const ConsultantsCollection = mongoose.model<IConsultant>('consultant', consultantSchema, 'consultants');