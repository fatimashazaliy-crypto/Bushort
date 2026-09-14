import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useVideoStore } from '../store/store';
import { videoAPI } from '../api/endpoints';
import Ionicons from '@expo/vector-icons/Ionicons';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

interface Video {
  id: string;
  user_id: string;
  video_url: string;
  caption?: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
  thumbnail_url?: string;
  created_at: string;
}

const HomeScreen = () => {
  const { videos, setVideos } = useVideoStore();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      setIsLoading(true);
      const response = await videoAPI.getFeed(20, page * 20);
      setVideos(response.data.videos);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (videoId: string) => {
    try {
      await videoAPI.likeVideo(videoId);
      // Update local state
      const updatedVideos = videos.map((v) =>
        v.id === videoId ? { ...v, likes_count: v.likes_count + 1 } : v
      );
      setVideos(updatedVideos);
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const renderVideo = ({ item }: { item: Video }) => (
    <View style={styles.videoContainer}>
      <Image
        source={{ uri: item.thumbnail_url || 'https://via.placeholder.com/400x600' }}
        style={styles.thumbnail}
      />
      <View style={styles.videoOverlay}>
        <Text style={styles.caption}>{item.caption}</Text>
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.stat} onPress={() => handleLike(item.id)}>
            <Ionicons name="heart" size={24} color="#FF006E" />
            <Text style={styles.statText}>{item.likes_count}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stat}>
            <Ionicons name="chatbubble" size={24} color="#FFF" />
            <Text style={styles.statText}>{item.comments_count}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stat}>
            <Ionicons name="eye" size={24} color="#FFF" />
            <Text style={styles.statText}>{item.views_count}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (isLoading && videos.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF006E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={renderVideo}
        keyExtractor={(item) => item.id}
        pagingEnabled
        snapToInterval={screenHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0C',
  },
  videoContainer: {
    height: screenHeight,
    width: screenWidth,
    position: 'relative',
  },
  thumbnail: {
    height: '100%',
    width: '100%',
    backgroundColor: '#1A1A1F',
  },
  videoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(10, 10, 12, 0.6)',
  },
  caption: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statText: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 4,
  },
});

export default HomeScreen;
