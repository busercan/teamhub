import { Server, Socket } from 'socket.io';
import { socketAuth } from './socketAtuh';
import {
  getUnreadMessagesForSocket,
  saveOfflineMessageForSocket,
} from '../controllers/messageController';

export const setupChatSocket = (io: Server) => {
  io.use(socketAuth);

  io.on('connection', async (socket: Socket) => {
    try {
      const userId = socket.data.userId;

      if (!userId) {
        console.warn('Socket connected without userId, disconnecting.');
        return socket.disconnect(true);
      }

      console.log('User connected: ${userId}');
      socket.join(userId);

      const unread = await getUnreadMessagesForSocket(userId);
      if (unread.length > 0) {
        socket.emit('unread_messages', unread);
      }

      socket.on(
        'private_message',
        async (data: { to: string; message: string }, ack?: (response: any) => void) => {
          try {
            const { to, message } = data;
            if (!to || !message) {
              return ack?.({
                ok: false,
                error: "Missing 'to' or 'message'",
              });
            }

            const targetSockets = await io.in(to).fetchSockets();

            if (targetSockets.length > 0) {
              io.to(to).emit('private_message', {
                from: userId,
                message,
                createdAt: new Date(),
              });

              console.log('Message sent to online user ${to}');
              ack?.({ ok: true, delivered: true });
            } else {
              await saveOfflineMessageForSocket(userId, to, message);
              console.log('Offline message stored for user ${to}');
              ack?.({ ok: true, delivered: false, offlineSaved: true });
            }
          } catch (err) {
            console.error('Error handling private_message:', err);
            ack?.({ ok: false, error: 'Server error' });
          }
        }
      );

      socket.on('message_read', async (data: { messageId: string; from: string }) => {
        try {
          if (data?.from) {
            io.to(data.from).emit('message_read', {
              messageId: data.messageId,
              by: userId,
            });
          }
        } catch (err) {
          console.error('Error handling message_read:', err);
        }
      });

      socket.on('disconnect', (reason) => {
        console.log('User disconnected: ${userId} (${reason})');
      });
    } catch (err) {
      console.error('Socket connection error:', err);
      socket.disconnect(true);
    }
  });
};
