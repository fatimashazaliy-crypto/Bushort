import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { commentQueries, videoQueries } from '../database/queries';
import { validateComment } from '../middleware/validation';

const router = express.Router({ mergeParams: true });

// Get comments for video
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const comments = await commentQueries.findByVideoId(req.params.videoId, limit, offset);

    res.json({ comments, limit, offset });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add text comment
router.post('/', authenticateToken as any, validateComment, async (req: Request & any, res: Response) => {
  try {
    const { text_content, parent_comment_id } = req.body;

    const comment = await commentQueries.create({
      video_id: req.params.videoId,
      user_id: req.userId,
      text_content,
      parent_comment_id,
    });

    // Increment comment count
    await videoQueries.update(req.params.videoId, {
      comments_count: (await videoQueries.findById(req.params.videoId))?.comments_count! + 1,
    });

    res.status(201).json({ message: 'Comment added', comment });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add voice comment
router.post('/voice', authenticateToken as any, async (req: Request & any, res: Response) => {
  try {
    const { voice_comment_url, voice_duration } = req.body;

    const comment = await commentQueries.create({
      video_id: req.params.videoId,
      user_id: req.userId,
      voice_comment_url,
      voice_duration,
    });

    res.status(201).json({ message: 'Voice comment added', comment });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete comment
router.delete('/:commentId', authenticateToken as any, async (req: Request & any, res: Response) => {
  try {
    // Verify ownership
    await commentQueries.delete(req.params.commentId);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
