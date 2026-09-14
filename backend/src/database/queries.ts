import db from './connection';
import { User, Video } from './types';

// User queries
export const userQueries = {
  async findById(id: string): Promise<User | undefined> {
    return db('users').where('id', id).first();
  },

  async findByEmail(email: string): Promise<User | undefined> {
    return db('users').where('email', email).first();
  },

  async findByUsername(username: string): Promise<User | undefined> {
    return db('users').where('username', username).first();
  },

  async create(user: Partial<User>): Promise<User> {
    const [created] = await db('users').insert(user).returning('*');
    return created;
  },

  async update(id: string, data: Partial<User>): Promise<User> {
    const [updated] = await db('users').where('id', id).update(data).returning('*');
    return updated;
  },

  async delete(id: string): Promise<void> {
    await db('users').where('id', id).delete();
  },
};

// Video queries
export const videoQueries = {
  async findById(id: string): Promise<Video | undefined> {
    return db('videos').where('id', id).first();
  },

  async findByUserId(userId: string, limit = 20, offset = 0): Promise<Video[]> {
    return db('videos')
      .where('user_id', userId)
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);
  },

  async getFeed(userId: string, limit = 20, offset = 0): Promise<Video[]> {
    return db('videos')
      .leftJoin('follows', 'videos.user_id', 'follows.following_id')
      .where((builder) => {
        builder
          .where('videos.user_id', userId)
          .orWhere('follows.follower_id', userId);
      })
      .where('videos.visibility', 'public')
      .select('videos.*')
      .distinct()
      .orderBy('videos.created_at', 'desc')
      .limit(limit)
      .offset(offset);
  },

  async create(video: Partial<Video>): Promise<Video> {
    const [created] = await db('videos').insert(video).returning('*');
    return created;
  },

  async update(id: string, data: Partial<Video>): Promise<Video> {
    const [updated] = await db('videos').where('id', id).update(data).returning('*');
    return updated;
  },

  async incrementViews(id: string): Promise<void> {
    await db('videos').where('id', id).increment('views_count', 1);
  },

  async delete(id: string): Promise<void> {
    await db('videos').where('id', id).delete();
  },
};

// Comment queries
export const commentQueries = {
  async findByVideoId(videoId: string, limit = 20, offset = 0) {
    return db('comments')
      .where('video_id', videoId)
      .where('parent_comment_id', null)
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);
  },

  async create(comment: any) {
    const [created] = await db('comments').insert(comment).returning('*');
    return created;
  },

  async delete(id: string): Promise<void> {
    await db('comments').where('id', id).delete();
  },
};

// Follow queries
export const followQueries = {
  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await db('follows')
      .where('follower_id', followerId)
      .where('following_id', followingId)
      .first();
    return !!follow;
  },

  async follow(followerId: string, followingId: string) {
    return db('follows').insert({ follower_id: followerId, following_id: followingId });
  },

  async unfollow(followerId: string, followingId: string) {
    return db('follows')
      .where('follower_id', followerId)
      .where('following_id', followingId)
      .delete();
  },

  async getFollowers(userId: string, limit = 20, offset = 0) {
    return db('users')
      .join('follows', 'users.id', 'follows.follower_id')
      .where('follows.following_id', userId)
      .select('users.*')
      .limit(limit)
      .offset(offset);
  },

  async getFollowing(userId: string, limit = 20, offset = 0) {
    return db('users')
      .join('follows', 'users.id', 'follows.following_id')
      .where('follows.follower_id', userId)
      .select('users.*')
      .limit(limit)
      .offset(offset);
  },
};

// Like queries
export const likeQueries = {
  async isLiked(userId: string, videoId: string): Promise<boolean> {
    const like = await db('likes')
      .where('user_id', userId)
      .where('video_id', videoId)
      .first();
    return !!like;
  },

  async like(userId: string, videoId: string) {
    await db('likes').insert({ user_id: userId, video_id: videoId });
    await db('videos').where('id', videoId).increment('likes_count', 1);
  },

  async unlike(userId: string, videoId: string) {
    await db('likes')
      .where('user_id', userId)
      .where('video_id', videoId)
      .delete();
    await db('videos').where('id', videoId).decrement('likes_count', 1);
  },
};

// Message queries
export const messageQueries = {
  async findConversation(user1: string, user2: string) {
    return db('conversations')
      .where((builder) => {
        builder
          .where('user_id_1', user1)
          .where('user_id_2', user2)
          .orWhere('user_id_1', user2)
          .where('user_id_2', user1);
      })
      .first();
  },

  async createConversation(user1: string, user2: string) {
    const [conversation] = await db('conversations')
      .insert({ user_id_1: user1, user_id_2: user2 })
      .returning('*');
    return conversation;
  },

  async getMessages(conversationId: string, limit = 30, offset = 0) {
    return db('messages')
      .where('conversation_id', conversationId)
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);
  },

  async createMessage(message: any) {
    const [created] = await db('messages').insert(message).returning('*');
    return created;
  },
};

// Notification queries
export const notificationQueries = {
  async findByUserId(userId: string, limit = 20, offset = 0) {
    return db('notifications')
      .where('user_id', userId)
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);
  },

  async create(notification: any) {
    const [created] = await db('notifications').insert(notification).returning('*');
    return created;
  },

  async markAsRead(id: string) {
    await db('notifications').where('id', id).update({ is_read: true });
  },
};
