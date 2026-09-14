// Type definitions for database models

export interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  website: string | null;
  location: string | null;
  is_verified: boolean;
  is_private: boolean;
  is_banned: boolean;
  created_at: Date;
  updated_at: Date;
  last_login_at: Date | null;
}

export interface Video {
  id: string;
  user_id: string;
  video_url: string;
  thumbnail_url: string | null;
  caption: string | null;
  audio_track: string | null;
  hashtags: string[];
  views_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  saves_count: number;
  duration: number;
  visibility: 'public' | 'private' | 'friends';
  allow_comments: boolean;
  allow_duets: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Comment {
  id: string;
  video_id: string;
  user_id: string;
  parent_comment_id: string | null;
  text_content: string | null;
  voice_comment_url: string | null;
  voice_duration: number | null;
  likes_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  text_content: string | null;
  image_url: string | null;
  video_url: string | null;
  voice_url: string | null;
  voice_duration: number | null;
  reply_to_id: string | null;
  is_deleted: boolean;
  read_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface Conversation {
  id: string;
  user_id_1: string;
  user_id_2: string;
  last_message_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface Notification {
  id: string;
  user_id: string;
  actor_id: string | null;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'share' | 'message';
  video_id: string | null;
  comment_id: string | null;
  message: string | null;
  is_read: boolean;
  created_at: Date;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: Date;
}

export interface Like {
  id: string;
  user_id: string;
  video_id: string;
  created_at: Date;
}

export interface Save {
  id: string;
  user_id: string;
  video_id: string;
  created_at: Date;
}
