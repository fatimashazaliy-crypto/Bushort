import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '../store/store';
import { userAPI } from '../api/endpoints';
import Ionicons from '@expo/vector-icons/Ionicons';

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  followers_count: number;
  following_count: number;
}

const ProfileScreen = () => {
  const { user, logout } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  const loadProfile = async () => {
    try {
      if (!user?.id) return;
      const response = await userAPI.getUserProfile(user.id);
      setProfile(response.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FF006E" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color="#FF006E" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{
            uri: profile?.avatar_url || 'https://via.placeholder.com/120',
          }}
          style={styles.avatar}
        />
        <Text style={styles.displayName}>{profile?.display_name || user?.username}</Text>
        <Text style={styles.username}>@{profile?.username}</Text>
        <Text style={styles.bio}>{profile?.bio || 'No bio yet'}</Text>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{profile?.followers_count || 0}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{profile?.following_count || 0}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>42</Text>
          <Text style={styles.statLabel}>Videos</Text>
        </View>
      </View>

      <View style={styles.buttonsSection}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-social" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.videosSection}>
        <Text style={styles.sectionTitle}>My Videos</Text>
        <View style={styles.videosGrid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <TouchableOpacity key={i} style={styles.videoTile}>
              <Image
                source={{ uri: 'https://via.placeholder.com/150' }}
                style={styles.videoTileImage}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0C',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1F',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  displayName: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  username: {
    color: '#999',
    fontSize: 14,
    marginTop: 4,
  },
  bio: {
    color: '#CCC',
    fontSize: 14,
    marginTop: 12,
    maxWidth: '80%',
    textAlign: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#1A1A1F',
    borderBottomColor: '#1A1A1F',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#FF006E',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
  buttonsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#FF006E',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: '#1A1A1F',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  videosSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  videosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  videoTile: {
    width: '31%',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  videoTileImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#1A1A1F',
  },
});

export default ProfileScreen;
