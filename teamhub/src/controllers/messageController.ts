import { Request, Response } from 'express';
import Message, { IMessage } from '../models/message';
import redisClient from '../config/redis';

export const getAllMessagesForSocket = async (userId: string) => {
  try {
    const messages = await Message.find({
  $or: [{ to: userId }, { from: userId }]}).sort({ createdAt: 1 });
    return messages.map((msg) => ({
      id: msg._id,
      from: msg.from,
      to: msg.to,
      message: msg.message,
      read: msg.read,
      createdAt: msg.createdAt
    }));
  } catch (err) {
    console.error('Error fetching messages (socket):', err);
    return [];
  }
};

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

export const saveAllMessageForSocket = async (from: string, to: string, message: string) => {
  try {
    const msg = new Message({ from, to, message, read: false });
    await msg.save();
    return msg;
  } catch (err) {
    console.error('Error saving message (socket):', err);
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

export const getOnlineUsers = async (req: Request, res: Response) => {
  try {
    const keys = await redisClient.keys('online:*');
    const onlineUserIds = keys.map(k => k.split(':')[1]);

    return res.status(200).json({ success: true, onlineUsers: onlineUserIds });
  } catch (err) {
    console.error('Error fetching online users:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};