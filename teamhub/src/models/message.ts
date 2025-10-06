import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  from: string;
  to: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model<IMessage>('Message', MessageSchema);
export default Message;
