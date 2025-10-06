import { Socket } from 'socket.io';
import jwt from 'jwt-simple';

export const socketAuth = async (socket: Socket, next: (err?: any) => void) => {
  try {
    let token =
      socket.handshake.auth?.token ||
      (socket.handshake.query && (socket.handshake.query as any).token) ||
      socket.handshake.headers?.authorization;

    if (typeof token === 'string' && token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    if (!token) {
      return next(new Error('No token provided'));
    }

    const decoded: any = jwt.decode(token as string, process.env.JWT_SECRET as string);

    if (!decoded || (decoded.exp && decoded.exp * 1000 < Date.now())) {
      return next(new Error('Invalid or expired token'));
    }

    socket.data.userId = decoded.id;
    next();
  } catch (err) {
    console.error('Socket auth error:', err);
    next(new Error('Authentication failed'));
  }
};
