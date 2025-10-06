import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRole extends Document {
  name: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    permissions: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export default mongoose.model<IRole>('Role', RoleSchema);
