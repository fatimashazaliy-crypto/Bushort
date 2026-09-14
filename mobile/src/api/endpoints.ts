import api from './axios';

export const authAPI = {
  signup: (data: { email: string; password: string; username: string; display_name?: string }) =>
    api.post('/auth/signup', data),
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/users/me'),
};

export const userAPI = {
  getUserProfile: (userId: string) => api.get(`/users/${userId}`),
  updateProfile: (data: any) => api.put('/users/me', data),
  follow: (userId: string) => api.post(`/users/${userId}/follow`),
  unfollow: (userId: string) => api.delete(`/users/${userId}/follow`),
  getFollowers: (userId: string) => api.get(`/users/${userId}/followers`),
  getFollowing: (userId: string) => api.get(`/users/${userId}/following`),
};

export const videoAPI = {
  getFeed: (limit: number = 20, offset: number = 0) =>
    api.get('/videos/feed', { params: { limit, offset } }),
  getVideo: (videoId: string) => api.get(`/videos/${videoId}`),
  uploadVideo: (data: any) => api.post('/videos', data),
  likeVideo: (videoId: string) => api.post(`/videos/${videoId}/like`),
  unlikeVideo: (videoId: string) => api.delete(`/videos/${videoId}/like`),
};

export const commentAPI = {
  getComments: (videoId: string, limit: number = 20, offset: number = 0) =>
    api.get(`/videos/${videoId}/comments`, { params: { limit, offset } }),
  addComment: (videoId: string, text_content: string) =>
    api.post(`/videos/${videoId}/comments`, { text_content }),
  addVoiceComment: (videoId: string, voice_comment_url: string, voice_duration: number) =>
    api.post(`/videos/${videoId}/comments/voice`, { voice_comment_url, voice_duration }),
  deleteComment: (commentId: string) => api.delete(`/comments/${commentId}`),
};

export const messageAPI = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (conversationId: string, limit: number = 30, offset: number = 0) =>
    api.get(`/messages/conversations/${conversationId}`, { params: { limit, offset } }),
  sendMessage: (recipientId: string, text_content: string, conversation_id?: string) =>
    api.post('/messages', { recipient_id: recipientId, text_content, conversation_id }),
  sendVoiceMessage: (recipientId: string, voice_url: string, voice_duration: number) =>
    api.post('/messages/voice', { recipient_id: recipientId, voice_url, voice_duration }),
  deleteMessage: (messageId: string) => api.delete(`/messages/${messageId}`),
};

export const notificationAPI = {
  getNotifications: (limit: number = 20, offset: number = 0) =>
    api.get('/notifications', { params: { limit, offset } }),
  markAsRead: (notificationId: string) => api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (notificationId: string) => api.delete(`/notifications/${notificationId}`),
};
