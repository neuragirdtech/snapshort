import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft, Sliders, Sparkles } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

import { RootStackParamList } from '../../navigation/AppNavigator';
import { Colors, Typography } from '../../../core/constants/theme';
import { useVideoStore } from '../../hooks/useVideoStore';
import { VideoRepositoryImpl } from '../../../data/repositories/VideoRepositoryImpl';
import { UploadVideoUseCase } from '../../../domain/usecases/UploadVideoUseCase';

// Modular Components
import { PromptCard } from './components/PromptCard';
import { VisualControls } from './components/VisualControls';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VideoConfig'>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'VideoConfig'>;

const CreativeConfigScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const { videoUri } = route.params;

  const { setProcessing, setUploadProgress, setCurrentVideo, setError, isProcessing, uploadProgress } = useVideoStore();

  const [prompt, setPrompt] = useState('Create a 15-second cinematic story about...');
  const [realism, setRealism] = useState(80);
  const [motion, setMotion] = useState('drone');
  const [clipCount, setClipCount] = useState(3);
  const [aspectRatio, setAspectRatio] = useState('9:16');

  const handleGenerate = async () => {
    try {
      setProcessing(true);
      setError(null);
      
      const repository = new VideoRepositoryImpl();
      const uploadUseCase = new UploadVideoUseCase(repository);

      // PANGGILAN BACKEND ASLI
      const video = await uploadUseCase.execute(
        videoUri,
        (p) => setUploadProgress(p),
        { 
          prompt, 
          realism, 
          motion, 
          clipCount, 
          aspectRatio, 
          subtitleColor: 'auto' 
        }
      );

      setCurrentVideo(video);
      navigation.navigate('Editor', { videoId: video.id });
      
    } catch (err) {
      console.error('Generation Error:', err);
      setError('Failed to craft content.');
      Alert.alert('Error', 'Generation failed. Please check your connection or credits.');
    } finally {
      setProcessing(false);
      setUploadProgress(0);
    }
  };

  if (isProcessing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Crafting Your AI Story... {uploadProgress}%</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Creative Studio</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Sliders size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Story Concept</Text>
        <PromptCard prompt={prompt} setPrompt={setPrompt} />

        <Text style={styles.sectionLabel}>Creative Controls</Text>
        <VisualControls 
          realism={realism} setRealism={setRealism} 
          motion={motion} setMotion={setMotion} 
          clipCount={clipCount} setClipCount={setClipCount}
          aspectRatio={aspectRatio} setAspectRatio={setAspectRatio}
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleGenerate} activeOpacity={0.8}>
          <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.generateBtn}>
            <Sparkles size={24} color="#FFF" />
            <Text style={styles.generateText}>Generate AI Short</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1A1A1D', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { ...Typography.h3, color: '#FFF', fontWeight: 'bold' },
  scroll: { padding: 20, paddingBottom: 150 },
  sectionLabel: { ...Typography.h3, color: '#FFF', marginBottom: 16, marginTop: 24 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 40, backgroundColor: 'rgba(0,0,0,0.8)' },
  generateBtn: { height: 64, borderRadius: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
  generateText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  loadingContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#FFF', marginTop: 20, fontWeight: 'bold' },
});

export default CreativeConfigScreen;
