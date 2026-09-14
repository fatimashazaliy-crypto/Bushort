import express, { Request, Response } from 'express';
import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { authenticateToken } from '../middleware/auth';

let io: SocketIOServer;
const userSockets = new Map<string, string>(); // userId -> socketId

export const initializeSocket = (httpServer: HTTPServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001'],
      methods: ['GET', 'POST'],
    },
  });

  // Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    next();
  });

  // Connection
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    // User joins
    socket.on('user:join', (userId: string) => {
      userSockets.set(userId, socket.id);
      io.emit('user:online', { userId });
    });

    // Message events
    socket.on('message:send', (data) => {
      const { conversationId, senderId, recipientId, text_content } = data;
      const recipientSocketId = userSockets.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('message:receive', {
          conversationId,
          senderId,
          text_content,
          timestamp: new Date(),
        });
      }
    });

    // Typing events
    socket.on('typing:start', (data) => {
      const { conversationId, userId } = data;
      socket.broadcast.emit('typing:start', { conversationId, userId });
    });

    socket.on('typing:stop', (data) => {
      const { conversationId, userId } = data;
      socket.broadcast.emit('typing:stop', { conversationId, userId });
    });

    // Notification events
    socket.on('notification:new', (data) => {
      const { userId, type, message } = data;
      const userSocketId = userSockets.get(userId);
      if (userSocketId) {
        io.to(userSocketId).emit('notification:new', { type, message });
      }
    });

    // Disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      let disconnectedUserId: string | undefined;
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          userSockets.delete(userId);
          break;
        }
      }
      if (disconnectedUserId) {
        io.emit('user:offline', { userId: disconnectedUserId });
      }
    });
  });

  return io;
};

export const getIO = () => io;
export const getUserSocket = (userId: string) => userSockets.get(userId);
