import React, { useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchImageLibrary } from 'react-native-image-picker';
import { UploadCloud, PlayCircle } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

import { RootStackParamList } from '../../navigation/AppNavigator';
import { Colors, Spacing, Typography } from '../../../core/constants/theme';
import { useVideoStore } from '../../hooks/useVideoStore';
import { UploadVideoUseCase } from '../../../domain/usecases/UploadVideoUseCase';
import { VideoRepositoryImpl } from '../../../data/repositories/VideoRepositoryImpl';
import { useAuthStore } from '../../hooks/useAuthStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { 
    isProcessing, 
    uploadProgress, 
    setProcessing, 
    setUploadProgress, 
    setCurrentVideo, 
    setError 
  } = useVideoStore();

  const handlePickVideo = useCallback(async () => {
    const result = await launchImageLibrary({
      mediaType: 'video',
      selectionLimit: 1,
    });

    if (result.didCancel || !result.assets || result.assets.length === 0) {
      return;
    }

    const videoUri = result.assets[0].uri;
    if (!videoUri) return;

    try {
      setProcessing(true);
      setError(null);
      
      const repository = new VideoRepositoryImpl();
      const uploadUseCase = new UploadVideoUseCase(repository);

      const video = await uploadUseCase.execute(videoUri, (progress) => {
        setUploadProgress(progress);
      });

      setCurrentVideo(video);
      navigation.navigate('Result', { videoId: video.id });
    } catch (err) {
      setError('Failed to upload video. Please try again.');
      Alert.alert('Error', 'Failed to upload video');
    } finally {
      setProcessing(false);
      setUploadProgress(0);
    }
  }, [navigation, setProcessing, setUploadProgress, setCurrentVideo, setError]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View>
            <Text style={Typography.h1}>Long Video to</Text>
            <Text style={[Typography.h1, { color: Colors.primary }]}>Short Clips</Text>
          </View>
          <TouchableOpacity onPress={() => useAuthStore.getState().logout()} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
        <Text style={[Typography.body, styles.subtitle]}>
          Automatically cut your videos, add subtitles, and get them ready for TikTok, Reels, and Shorts.
        </Text>
      </View>

      <View style={styles.content}>
        {isProcessing ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.processingText}>Processing Video... {uploadProgress}%</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${uploadProgress}%` }]} />
            </View>
          </View>
        ) : (
          <TouchableOpacity onPress={handlePickVideo} activeOpacity={0.8}>
            <LinearGradient
              colors={[Colors.primary, Colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.uploadCard}
            >
              <UploadCloud color={Colors.text} size={48} />
              <Text style={styles.uploadTitle}>Pick a Video</Text>
              <Text style={styles.uploadSubtitle}>MP4, MOV up to 500MB</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.featureItem}>
          <PlayCircle color={Colors.primary} size={24} />
          <Text style={styles.featureText}>Auto Captions</Text>
        </View>
        <View style={styles.featureItem}>
          <PlayCircle color={Colors.primary} size={24} />
          <Text style={styles.featureText}>Smart Framing</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  header: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl * 2,
  },
  subtitle: {
    marginTop: Spacing.md,
    lineHeight: 22,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  uploadCard: {
    height: 240,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  uploadTitle: {
    ...Typography.h2,
    marginTop: Spacing.md,
  },
  uploadSubtitle: {
    ...Typography.caption,
    marginTop: Spacing.xs,
    color: 'rgba(255,255,255,0.7)',
  },
  processingContainer: {
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  processingText: {
    ...Typography.body,
    marginTop: Spacing.md,
    fontWeight: '600',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    width: '100%',
    marginTop: Spacing.lg,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    ...Typography.body,
    marginLeft: Spacing.sm,
    fontWeight: '500',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logoutBtn: {
    padding: Spacing.sm,
  },
  logoutText: {
    ...Typography.caption,
    color: Colors.error,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
