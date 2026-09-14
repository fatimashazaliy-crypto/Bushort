import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { userQueries, followQueries } from '../database/queries';

const router = express.Router();

// Get current user profile
router.get('/me', authenticateToken as any, async (req: Request & any, res: Response) => {
  try {
    const user = await userQueries.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get follower counts
    const followers = await followQueries.getFollowers(req.userId, 1000);
    const following = await followQueries.getFollowing(req.userId, 1000);

    res.json({
      ...user,
      followers_count: followers.length,
      following_count: following.length,
      password: undefined, // Don't send password
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile by ID
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const user = await userQueries.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const followers = await followQueries.getFollowers(req.params.userId, 1000);
    const following = await followQueries.getFollowing(req.params.userId, 1000);

    res.json({
      id: user.id,
      username: user.username,
      display_name: user.display_name,
      avatar_url: user.avatar_url,
      cover_url: user.cover_url,
      bio: user.bio,
      website: user.website,
      location: user.location,
      is_verified: user.is_verified,
      followers_count: followers.length,
      following_count: following.length,
      created_at: user.created_at,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/me', authenticateToken as any, async (req: Request & any, res: Response) => {
  try {
    const { display_name, bio, avatar_url, cover_url, website, location } = req.body;

    const updated = await userQueries.update(req.userId, {
      display_name,
      bio,
      avatar_url,
      cover_url,
      website,
      location,
    });

    res.json({ message: 'Profile updated', user: updated });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Follow user
router.post('/:userId/follow', authenticateToken as any, async (req: Request & any, res: Response) => {
  try {
    if (req.userId === req.params.userId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const isFollowing = await followQueries.isFollowing(req.userId, req.params.userId);
    if (isFollowing) {
      return res.status(400).json({ error: 'Already following' });
    }

    await followQueries.follow(req.userId, req.params.userId);
    res.json({ message: 'Followed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Unfollow user
router.delete('/:userId/follow', authenticateToken as any, async (req: Request & any, res: Response) => {
  try {
    await followQueries.unfollow(req.userId, req.params.userId);
    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get followers
router.get('/:userId/followers', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const followers = await followQueries.getFollowers(req.params.userId, limit, offset);
    res.json({ followers });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get following
router.get('/:userId/following', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const following = await followQueries.getFollowing(req.params.userId, limit, offset);
    res.json({ following });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
