import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { videoAPI } from '../api/endpoints';

const CreateScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(false);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handlePickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (!result.canceled) {
      await uploadVideo(result.assets[0].uri);
    }
  };

  const uploadVideo = async (videoUri: string) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('video_url', videoUri);
      formData.append('caption', caption);
      formData.append('hashtags', hashtags.split(' ').filter((t) => t));

      await videoAPI.uploadVideo(formData);
      setCaption('');
      setHashtags('');
      alert('Video uploaded successfully!');
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionText}>Grant Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Video</Text>
      </View>

      <View style={styles.previewContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/400x600' }}
          style={styles.videoPreview}
        />
        <TouchableOpacity style={styles.recordButton}>
          <Ionicons name="camera" size={40} color="#FF006E" />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Caption</Text>
        <TextInput
          placeholder="What's in your video?"
          placeholderTextColor="#999"
          style={styles.input}
          value={caption}
          onChangeText={setCaption}
          multiline
          maxLength={500}
        />
        <Text style={styles.charCount}>{caption.length}/500</Text>

        <Text style={styles.label}>Hashtags</Text>
        <TextInput
          placeholder="#bushort #viral #trending"
          placeholderTextColor="#999"
          style={styles.input}
          value={hashtags}
          onChangeText={setHashtags}
        />

        <View style={styles.settingsContainer}>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Allow Comments</Text>
            <TouchableOpacity style={styles.toggle}>
              <View style={styles.toggleOn} />
            </TouchableOpacity>
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Allow Duets</Text>
            <TouchableOpacity style={styles.toggle}>
              <View style={styles.toggleOn} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
          onPress={handlePickVideo}
          disabled={isUploading}
        >
          <Ionicons name="cloud-upload" size={24} color="#FFF" />
          <Text style={styles.uploadButtonText}>
            {isUploading ? 'Uploading...' : 'Upload Video'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0C',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1F',
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  previewContainer: {
    height: 400,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1A1A1F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPreview: {
    width: '100%',
    height: '100%',
  },
  recordButton: {
    position: 'absolute',
    padding: 16,
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  label: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#1A1A1F',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFF',
    borderWidth: 1,
    borderColor: '#333',
  },
  charCount: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  settingsContainer: {
    marginTop: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1F',
  },
  settingLabel: {
    color: '#FFF',
    fontSize: 14,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF006E',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleOn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF',
    alignSelf: 'flex-end',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF006E',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 24,
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default CreateScreen;
