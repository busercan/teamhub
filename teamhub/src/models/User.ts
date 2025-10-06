import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  roles: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    roles: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Role' }],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
