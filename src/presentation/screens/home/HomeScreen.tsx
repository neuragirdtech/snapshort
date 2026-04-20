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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

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

    const asset = result.assets[0];
    const videoUri = asset.uri;
    const duration = asset.duration; // Dalam detik

    if (!videoUri) return;

    // Cek durasi (maksimal 10 menit / 600 detik)
    if (duration && duration > 600) {
      Alert.alert(
        'Video Too Long',
        'Maximum video duration is 10 minutes. Please pick a shorter video.'
      );
      return;
    }

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
      console.error(err);
      setError('Failed to upload video. Please try again.');
      Alert.alert('Error', 'Failed to upload video');
    } finally {
      setProcessing(false);
      setUploadProgress(0);
    }
  }, [navigation, setProcessing, setUploadProgress, setCurrentVideo, setError]);

  return (
    <View style={styles.container}>
      {/* Header Area */}
      <View style={styles.header}>
        <Text style={Typography.h1}>Long Video to</Text>
        <Text style={[Typography.h1, { color: Colors.primary }]}>Short Clips</Text>
        <Text style={[Typography.body, styles.subtitle]}>
          Automatically cut your videos for TikTok, Reels, and Shorts using AI.
        </Text>
      </View>

      {/* Main Content (Centered) */}
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

      {/* Footer Features */}
      <View style={styles.footer}>
        <View style={styles.featureItem}>
          <PlayCircle color={Colors.primary} size={20} />
          <Text style={styles.featureText}>Auto Captions</Text>
        </View>
        <View style={styles.featureItem}>
          <PlayCircle color={Colors.primary} size={20} />
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
    paddingHorizontal: Spacing.xl,
  },
  header: {
    marginTop: Spacing.xl,
    alignItems: 'center',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: Spacing.sm,
    lineHeight: 20,
    opacity: 0.7,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    transform: [{ translateY: -30 }], // Menggeser kartu ke atas sedikit
  },
  uploadCard: {
    height: 260,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
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
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: 32,
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
    marginTop: Spacing.xl,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: Spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    ...Typography.caption,
    marginLeft: Spacing.sm,
    fontWeight: '500',
    color: '#94A3B8',
  },
});

export default HomeScreen;
