import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { useVideoPlayer, VideoView } from 'react-native-video';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';

import { Colors } from '../../../core/constants/theme';
import { VideoApi } from '../../../data/api/VideoApi';
import { ApiConfig } from '../../../core/constants/api';

// Modular Components
import { PlayerHeader } from './components/PlayerHeader';
import { PlaybackControls } from './components/PlaybackControls';
import { Timeline } from './components/Timeline';
import { Toolbar } from './components/Toolbar';

/**
 * Sub-komponen internal untuk menangani Hook Player.
 * Hanya dirender saat source sudah tersedia.
 */
const VideoPlayerContent = ({ source, videoData, initialTitle, navigation, onSelectClip }: any) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);

  const player = useVideoPlayer(source, (_player) => {
    _player.loop = true;
    _player.play();
  });

  // Listener menggunakan polling (setInterval) karena listener API tidak terdeteksi
  useEffect(() => {
    const interval = setInterval(() => {
      if (player && typeof player.currentTime === 'number') {
        setCurrentTime(player.currentTime);
      }
    }, 100); // Update setiap 100ms agar smooth

    return () => clearInterval(interval);
  }, [player]);

  const togglePlay = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <SafeAreaView style={styles.content}>
      <PlayerHeader
        title={videoData?.title || initialTitle || ''}
        status={videoData?.status || ''}
        onBack={() => navigation.goBack()}
        onExport={() => { }}
      />

      <View style={styles.previewContainer}>
        <VideoView
          player={player}
          style={styles.videoView}
          resizeMode="cover"
        />
        {/* <View style={styles.captionOverlay}>
          <Text style={styles.captionText}>Silence before the descent</Text>
        </View> */}
      </View>

      {/* <PlaybackControls
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
      />

      <Timeline
        videoData={videoData}
        currentTime={currentTime}
        onSelectClip={onSelectClip}
      />

      <Toolbar /> */}
    </SafeAreaView>
  );
};

const VideoPlayerScreen = ({ route, navigation }: any) => {
  const { videoUri, title: initialTitle, videoId } = route.params || {};
  const [activeSource, setActiveSource] = useState(videoUri || '');

  const { data: videoData, isLoading: loading } = useQuery({
    queryKey: ['video', videoId],
    queryFn: () => VideoApi.getVideoDetail(videoId!),
    enabled: !!videoId,
  });

  // Sinkronisasi source dari data backend jika videoUri awal kosong
  useEffect(() => {
    if (videoData?.url && !activeSource) {
      setActiveSource(`${ApiConfig.BASE_URL}/${videoData.url}`);
    }
  }, [videoData, activeSource]);

  // Loading state: Menunggu sampai data dari React Query ada
  // ATAU sampai kita punya videoUri dari params
  if (loading || (!activeSource && videoId)) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ color: '#FFF', marginTop: 10 }}>Fetching video source...</Text>
      </View>
    );
  }

  // Jika benar-benar tidak ada source (kasus langka)
  if (!activeSource) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#FFF' }}>Video source not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VideoPlayerContent
        source={activeSource}
        videoData={videoData}
        initialTitle={initialTitle}
        navigation={navigation}
        onSelectClip={(url: string) => setActiveSource(url)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1 },
  previewContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoView: { width: '100%', height: '100%' },
  captionOverlay: {
    position: 'absolute', bottom: 40, backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8,
  },
  captionText: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },
});

export default VideoPlayerScreen;
