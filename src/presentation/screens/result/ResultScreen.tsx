import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import Video from 'react-native-video';
import { X } from 'lucide-react-native';

import { RootStackParamList } from '../../navigation/AppNavigator';
import { Colors, Spacing, Typography } from '../../../core/constants/theme';
import { useVideoStore } from '../../hooks/useVideoStore';
import { GetVideoClipsUseCase } from '../../../domain/usecases/GetVideoClipsUseCase';
import { VideoRepositoryImpl } from '../../../data/repositories/VideoRepositoryImpl';
import ClipItem from '../../components/ClipItem';
import { VideoClip } from '../../../domain/entities/Video';

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

const ResultScreen: React.FC = () => {
  const route = useRoute<ResultScreenRouteProp>();
  const { videoId } = route.params;
  const { clips, setClips, isProcessing, setProcessing, setError } = useVideoStore();
  
  const [selectedClip, setSelectedClip] = useState<VideoClip | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

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

  const renderClip = ({ item }: { item: VideoClip }) => (
    <ClipItem 
      clip={item} 
      onPreview={(clip) => setSelectedClip(clip)} 
      onDownload={(clip) => {
        // Implement download logic
        console.log('Download', clip.url);
      }} 
    />
  );

  const activeSubtitle = selectedClip?.subtitles?.find(
    s => currentTime >= s.startTime && currentTime <= s.endTime
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={Typography.h2}>Your Clips</Text>
        <Text style={Typography.caption}>We've found {clips.length} short clips from your video</Text>
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
             <Text style={styles.emptyText}>No clips found yet. Processing might take a few more seconds.</Text>
          }
        />
      )}

      {/* Preview Modal */}
      <Modal visible={!!selectedClip} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedClip?.title}</Text>
            <TouchableOpacity onPress={() => setSelectedClip(null)}>
              <X color={Colors.text} size={28} />
            </TouchableOpacity>
          </View>

          <View style={styles.videoContainer}>
            {selectedClip && (
              <>
                <Video
                  source={{ uri: selectedClip.url }}
                  style={styles.fullVideo}
                  resizeMode="contain"
                  controls={true}
                  onProgress={(data) => setCurrentTime(data.currentTime)}
                  repeat={true}
                />
                
                {activeSubtitle && (
                  <View style={styles.subtitleOverlay}>
                    <Text style={styles.subtitleText}>{activeSubtitle.text}</Text>
                  </View>
                )}
              </>
            )}
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.downloadButton}
              onPress={() => setSelectedClip(null)}
            >
              <Text style={styles.downloadButtonText}>Close Preview</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
  },
  listContent: {
    padding: Spacing.lg,
    paddingTop: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body,
    marginTop: Spacing.md,
    color: Colors.textDim,
  },
  emptyText: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: Spacing.xl,
    color: Colors.textDim,
    paddingHorizontal: Spacing.xl,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
  },
  modalTitle: {
    ...Typography.body,
    fontWeight: 'bold',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  fullVideo: {
    width: '100%',
    aspectRatio: 9 / 16,
  },
  subtitleOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  subtitleText: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: '#FFD700', // Yellow subtitles look premium
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    textTransform: 'uppercase',
  },
  modalFooter: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
  },
  downloadButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  downloadButtonText: {
    ...Typography.body,
    fontWeight: 'bold',
  },
});

export default ResultScreen;
