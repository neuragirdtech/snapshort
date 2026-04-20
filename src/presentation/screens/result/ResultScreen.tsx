import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Video } from 'react-native-video';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/AppNavigator';
import { Colors, Spacing, Typography } from '../../../core/constants/theme';
import { useVideoStore } from '../../hooks/useVideoStore';
import { GetVideoClipsUseCase } from '../../../domain/usecases/GetVideoClipsUseCase';
import { VideoRepositoryImpl } from '../../../data/repositories/VideoRepositoryImpl';
import ClipItem from '../../components/ClipItem';
import { VideoClip } from '../../../domain/entities/Video';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

const ResultScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ResultScreenRouteProp>();
  const { videoId } = route.params;
  const { clips, setClips, isProcessing, setProcessing, setError } = useVideoStore();
  
  const fetchClips = useCallback(async () => {
    try {
      setProcessing(true);
      const repository = new VideoRepositoryImpl();
      const getClipsUseCase = new GetVideoClipsUseCase(repository);
      const result = await getClipsUseCase.execute(videoId);
      setClips(result);
    } catch (err) {
      setError('Failed to load clips.');
    } finally {
      setProcessing(false);
    }
  }, [videoId, setClips, setProcessing, setError]);

  useEffect(() => {
    fetchClips();
  }, [fetchClips]);

  const handlePreview = (clip: VideoClip) => {
    navigation.navigate('VideoPlayer', {
      videoUrl: clip.url,
      title: clip.title
    });
  };

  const renderClip = ({ item }: { item: VideoClip }) => (
    <ClipItem 
      clip={item} 
      onPreview={() => handlePreview(item)} 
      onDownload={(clip) => {
        // Akan segera diimplementasikan
        console.log('Download', clip.url);
      }} 
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={Typography.h2}>Your Viral Clips</Text>
        <Text style={styles.subtitle}>We've found {clips.length} short clips from your video</Text>
      </View>

      {isProcessing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Fetching your clips...</Text>
        </View>
      ) : (
        <FlatList
          data={clips}
          renderItem={renderClip}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
             <View style={styles.emptyContainer}>
               <Text style={styles.emptyText}>No clips found yet. The AI is still working its magic...</Text>
             </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F12',
  },
  header: {
    padding: Spacing.lg,
    backgroundColor: '#16161A',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 16,
  },
  subtitle: {
    ...Typography.caption,
    color: '#94A3B8',
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body,
    marginTop: Spacing.md,
    color: '#94A3B8',
  },
  emptyContainer: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    textAlign: 'center',
    color: '#475569',
    paddingHorizontal: 40,
  },
});

export default ResultScreen;
