import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { messageQueries, notificationQueries } from '../database/queries';

const router = express.Router();

// Get all conversations
router.get('/conversations', authenticateToken as any, async (req: Request & any, res: Response) => {
  try {
    const conversations = await (req.app.get('db') as any)('conversations')
      .where((builder: any) => {
        builder.where('user_id_1', req.userId).orWhere('user_id_2', req.userId);
      })
      .orderBy('last_message_at', 'desc');

    res.json({ conversations });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get conversation messages
router.get('/conversations/:conversationId', authenticateToken as any, async (req: Request & any, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 30;
    const offset = parseInt(req.query.offset as string) || 0;

    const messages = await messageQueries.getMessages(req.params.conversationId, limit, offset);

    res.json({ messages, limit, offset });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Send text message
router.post('/', authenticateToken as any, async (req: Request & any, res: Response) => {
  try {
    const { conversation_id, text_content, recipient_id } = req.body;

    let conversationId = conversation_id;

    // If no conversation, create one
    if (!conversationId) {
      let conversation = await messageQueries.findConversation(req.userId, recipient_id);
      if (!conversation) {
        conversation = await messageQueries.createConversation(req.userId, recipient_id);
      }
      conversationId = conversation.id;
    }

    const message = await messageQueries.createMessage({
      conversation_id: conversationId,
      sender_id: req.userId,
      text_content,
    });

    // Create notification
    await notificationQueries.create({
      user_id: recipient_id,
      actor_id: req.userId,
      type: 'message',
      message: `${req.user?.username} sent you a message`,
    });

    res.status(201).json({ message: 'Message sent', data: message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send voice message
router.post('/voice', authenticateToken as any, async (req: Request & any, res: Response) => {
  try {
    const { conversation_id, voice_url, voice_duration, recipient_id } = req.body;

    let conversationId = conversation_id;

    if (!conversationId) {
      let conversation = await messageQueries.findConversation(req.userId, recipient_id);
      if (!conversation) {
        conversation = await messageQueries.createConversation(req.userId, recipient_id);
      }
      conversationId = conversation.id;
    }

    const message = await messageQueries.createMessage({
      conversation_id: conversationId,
      sender_id: req.userId,
      voice_url,
      voice_duration,
    });

    // Create notification
    await notificationQueries.create({
      user_id: recipient_id,
      actor_id: req.userId,
      type: 'message',
      message: `${req.user?.username} sent you a voice note`,
    });

    res.status(201).json({ message: 'Voice message sent', data: message });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete message
router.delete('/:messageId', authenticateToken as any, async (req: Request & any, res: Response) => {
  try {
    const db = req.app.get('db') as any;
    await db('messages')
      .where('id', req.params.messageId)
      .where('sender_id', req.userId)
      .update({ is_deleted: true });

    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
