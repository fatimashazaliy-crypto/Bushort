import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  loadFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,

  setUser: (user: User) => set({ user }),

  setTokens: (accessToken: string, refreshToken: string) => {
    AsyncStorage.setItem('accessToken', accessToken);
    AsyncStorage.setItem('refreshToken', refreshToken);
    set({ accessToken, refreshToken });
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    set({ user: null, accessToken: null, refreshToken: null });
  },

  loadFromStorage: async () => {
    try {
      const [accessToken, refreshToken, userStr] = await AsyncStorage.multiGet([
        'accessToken',
        'refreshToken',
        'user',
      ]);
      if (accessToken[1] && refreshToken[1] && userStr[1]) {
        set({
          accessToken: accessToken[1],
          refreshToken: refreshToken[1],
          user: JSON.parse(userStr[1]),
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));

interface Video {
  id: string;
  user_id: string;
  video_url: string;
  caption?: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
}

interface VideoStore {
  videos: Video[];
  isLoading: boolean;
  setVideos: (videos: Video[]) => void;
  addVideo: (video: Video) => void;
}

export const useVideoStore = create<VideoStore>((set) => ({
  videos: [],
  isLoading: false,
  setVideos: (videos: Video[]) => set({ videos }),
  addVideo: (video: Video) => set((state) => ({ videos: [video, ...state.videos] })),
}));

interface Message {
  id: string;
  sender_id: string;
  text_content?: string;
  voice_url?: string;
  created_at: string;
}

interface MessageStore {
  conversations: any[];
  messages: Message[];
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  conversations: [],
  messages: [],
  addMessage: (message: Message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages: Message[]) => set({ messages }),
}));
