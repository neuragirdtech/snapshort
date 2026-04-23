import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Type, Scissors, Wand2, Music, Settings } from 'lucide-react-native';

import { useVideoStore } from '../../hooks/useVideoStore';
import { VideoApi } from '../../../data/api/VideoApi';
import { RootStackParamList } from '../../navigation/AppNavigator';

// Modular Components
import { EditorHeader } from './components/EditorHeader';
import { VideoPreview } from './components/VideoPreview';
import { Timeline } from './components/Timeline';
import { Colors } from '../../../core/constants/theme';

type ScreenRouteProp = RouteProp<RootStackParamList, 'Editor'>;

const EditorScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ScreenRouteProp>();
  const { videoId, initialClipIndex = 0 } = route.params;

  const { setCurrentVideo } = useVideoStore();
  
  // State Management
  const [activeIndex, setActiveIndex] = useState(initialClipIndex);
  const [activeTextId, setActiveTextId] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('Text');
  
  const [localClips, setLocalClips] = useState<any[]>([]);
  const [videoInfo, setVideoInfo] = useState<any>(null);

  const { data: videoData, isLoading, isError } = useQuery({
    queryKey: ['video-detail', videoId],
    queryFn: () => VideoApi.getVideoDetail(videoId),
    staleTime: 300000,
  });

  useEffect(() => {
    if (videoData) {
      setCurrentVideo(videoData as any);
      const clips = videoData.clips || [];
      setLocalClips(clips);
      setVideoInfo(videoData);
      
      // Set default text for the active clip
      const activeClip = clips[activeIndex] || clips[0];
      if (activeClip?.subtitles) {
        try {
          const subs = typeof activeClip.subtitles === 'string' ? JSON.parse(activeClip.subtitles) : activeClip.subtitles;
          if (subs.length > 0) setActiveTextId(subs[0].id);
        } catch(e){}
      }
    }
  }, [videoData]);

  const handleClipClick = (index: number) => {
    setActiveIndex(index);
    setActiveTextId(undefined); // Reset text selection when clip changes
    
    // Auto select first text of this clip if exists
    const clip = localClips[index];
    if (clip?.subtitles) {
      try {
        const subs = typeof clip.subtitles === 'string' ? JSON.parse(clip.subtitles) : clip.subtitles;
        if (subs.length > 0) setActiveTextId(subs[0].id);
      } catch(e){}
    }
  };

  const handleTextClick = (textId: string, clipIndex: number) => {
    setActiveIndex(clipIndex);
    setActiveTextId(textId);
    setActiveTab('Text');
    console.log('Text Selected:', textId, 'in clip:', clipIndex);
  };

  const currentClip = localClips[activeIndex];

  // Parse subtitles untuk dikirim ke preview
  // PINDAHKAN KE SINI (DI ATAS IF LOADING/ERROR)
  const currentSubtitles = useMemo(() => {
    if (!currentClip?.subtitles) return [];
    try {
      return typeof currentClip.subtitles === 'string' 
        ? JSON.parse(currentClip.subtitles) 
        : currentClip.subtitles;
    } catch(e) { return []; }
  }, [currentClip]);

  if (isLoading && !videoInfo) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Fetching AI Studio...</Text>
      </View>
    );
  }

  if (isError || (!videoInfo && !isLoading)) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.loadingText, { color: Colors.error }]}>Failed to load content.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <EditorHeader 
        title={videoInfo?.title || 'Editor'} 
        metadata="1080p • 60 Fps" 
        onBack={() => navigation.goBack()} 
      />

      <View style={styles.mainContent}>
        <VideoPreview 
          videoUrl={currentClip?.url || videoInfo?.url}
          thumbnail={currentClip?.url || videoInfo?.url}
          subtitles={currentSubtitles}
          activeTextId={activeTextId}
        />
      </View>

      <View style={styles.footer}>
        <Timeline 
          clips={localClips} 
          activeIndex={activeIndex}
          activeTextId={activeTextId}
          onClipClick={handleClipClick}
          onTextClick={handleTextClick}
        />
        
        <View style={styles.bottomToolbar}>
          {[
            { name: 'AI Edit', Icon: Wand2 }, { name: 'Text', Icon: Type },
            { name: 'Trim', Icon: Scissors }, { name: 'Effects', Icon: Settings },
            { name: 'Music', Icon: Music },
          ].map(item => (
            <TouchableOpacity key={item.name} style={styles.toolbarItem} onPress={() => setActiveTab(item.name)}>
              <item.Icon 
                size={22} 
                color={activeTab === item.name ? Colors.primary : Colors.textDim} 
              />
              {activeTab === item.name && <View style={styles.activeDot} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  mainContent: { flex: 1 },
  loadingContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: Colors.textDim, marginTop: 15, fontSize: 13, fontWeight: '600' },
  footer: { backgroundColor: '#000', paddingBottom: 20 },
  bottomToolbar: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 25, 
    paddingTop: 15, 
    paddingBottom: 20,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#111',
  },
  toolbarItem: { alignItems: 'center', gap: 6 },
  activeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.primary }
});

export default EditorScreen;
