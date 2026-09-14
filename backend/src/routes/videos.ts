import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { videoQueries, likeQueries } from '../database/queries';
import { validateVideoUpload } from '../middleware/validation';

const router = express.Router();

// Get video feed
router.get('/feed', authenticateToken as any, async (req: Request & any, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const videos = await videoQueries.getFeed(req.userId, limit, offset);

    res.json({
      videos: videos.map((video: any) => ({
        ...video,
        creator: { id: video.user_id },
      })),
      limit,
      offset,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single video
router.get('/:videoId', async (req: Request, res: Response) => {
  try {
    const video = await videoQueries.findById(req.params.videoId);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Increment views
    await videoQueries.incrementViews(req.params.videoId);

    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload video
router.post('/', authenticateToken as any, validateVideoUpload, async (req: Request & any, res: Response) => {
  try {
    const { caption, hashtags, visibility, allow_comments, allow_duets } = req.body;

    // In production, handle file upload to AWS S3
    // For now, we expect video_url in the body
    const { video_url, thumbnail_url, duration } = req.body;

    const video = await videoQueries.create({
      user_id: req.userId,
      video_url,
      thumbnail_url,
      caption,
      hashtags: hashtags || [],
      visibility: visibility || 'public',
      allow_comments: allow_comments !== false,
      allow_duets: allow_duets !== false,
      duration: duration || 0,
    });

    res.status(201).json({ message: 'Video uploaded', video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Like video
router.post('/:videoId/like', authenticateToken as any, async (req: Request & any, res: Response) => {
  try {
    const isLiked = await likeQueries.isLiked(req.userId, req.params.videoId);
    if (isLiked) {
      return res.status(400).json({ error: 'Already liked' });
    }

    await likeQueries.like(req.userId, req.params.videoId);
    res.json({ message: 'Video liked' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Unlike video
router.delete('/:videoId/like', authenticateToken as any, async (req: Request & any, res: Response) => {
  try {
    await likeQueries.unlike(req.userId, req.params.videoId);
    res.json({ message: 'Video unliked' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
