export interface User {
  id: string;
  email: string;
  username: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  cover_url?: string;
  website?: string;
  location?: string;
  is_verified?: boolean;
  is_private?: boolean;
  followers_count: number;
  following_count: number;
  likes_received_count: number;
  created_at: string;
}

export type VideoVisibility = 'public' | 'private' | 'friends';

export interface Video {
  id: string;
  user_id: string;
  user?: User;
  video_url: string;
  thumbnail_url?: string;
  caption: string;
  audio_track?: string;
  hashtags: string[];
  views_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  saves_count: number;
  duration?: number;
  visibility: VideoVisibility;
  allow_comments: boolean;
  allow_duets: boolean;
  is_liked?: boolean;
  is_saved?: boolean;
  created_at: string;
}

export interface Comment {
  id: string;
  video_id: string;
  user_id: string;
  user?: User;
  text_content?: string;
  voice_comment_url?: string;
  voice_duration?: number;
  likes_count: number;
  is_liked?: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  text_content?: string;
  voice_url?: string;
  voice_duration?: number;
  is_deleted?: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  participant_ids: string[];
  last_message_at: string;
  last_message?: string;
  unread_count?: number;
}

export interface Notification {
  id: string;
  user_id: string;
  actor_id: string;
  actor?: User;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'share' | 'message';
  video_id?: string;
  message?: string;
  is_read: boolean;
  created_at: string;
}
