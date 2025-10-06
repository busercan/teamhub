import { Request, Response } from 'express';
import Message, { IMessage } from '../models/message';

export const getUnreadMessagesForSocket = async (userId: string) => {
  try {
    const messages = await Message.find({ to: userId, read: false }).sort({ createdAt: 1 });
    return messages.map((msg) => ({
      from: msg.from,
      message: msg.message,
      createdAt: msg.createdAt,
    }));
  } catch (err) {
    console.error('Error fetching unread messages (socket):', err);
    return [];
  }
};

export const saveOfflineMessageForSocket = async (from: string, to: string, message: string) => {
  try {
    const msg = new Message({ from, to, message });
    await msg.save();
    return msg;
  } catch (err) {
    console.error('Error saving offline message (socket):', err);
    return null;
  }
};

export const getUnreadMessages = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const messages = await Message.find({ to: userId, read: false }).sort({ createdAt: 1 });
    return res.status(200).json({ success: true, messages });
  } catch (err) {
    console.error('Error fetching unread messages (REST):', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const saveOfflineMessage = async (req: Request, res: Response) => {
  try {
    const from = (req as any).user?.id;
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ success: false, message: "Missing 'to' or 'message' field" });
    }

    const msg = new Message({ from, to, message });
    await msg.save();

    return res.status(201).json({ success: true, message: msg });
  } catch (err) {
    console.error('Error saving offline message (REST):', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
