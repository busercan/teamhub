import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  status: string;
  assignedTo: Types.ObjectId;
  createdBy: Types.ObjectId;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>('Task', TaskSchema);
