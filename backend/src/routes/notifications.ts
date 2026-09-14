import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { notificationQueries } from '../database/queries';

const router = express.Router();

// Get all notifications
router.get('/', authenticateToken as any, async (req: Request & any, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const notifications = await notificationQueries.findByUserId(req.userId, limit, offset);

    res.json({ notifications, limit, offset });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark notification as read
router.put('/:notificationId/read', authenticateToken as any, async (req: Request & any, res: Response) => {
  try {
    await notificationQueries.markAsRead(req.params.notificationId);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark all as read
router.put('/read-all', authenticateToken as any, async (req: Request & any, res: Response) => {
  try {
    const db = req.app.get('db') as any;
    await db('notifications')
      .where('user_id', req.userId)
      .update({ is_read: true });

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete notification
router.delete('/:notificationId', authenticateToken as any, async (req: Request & any, res: Response) => {
  try {
    const db = req.app.get('db') as any;
    await db('notifications')
      .where('id', req.params.notificationId)
      .where('user_id', req.userId)
      .delete();

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
