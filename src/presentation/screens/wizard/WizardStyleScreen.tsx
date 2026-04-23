import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Colors, Spacing, Typography } from '../../../core/constants/theme';
import { WizardProgress } from '../home/components/WizardProgress';
import { useVideoStore } from '../../hooks/useVideoStore';
import { VideoRepositoryImpl } from '../../../data/repositories/VideoRepositoryImpl';
import { UploadVideoUseCase } from '../../../domain/usecases/UploadVideoUseCase';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'WizardStyle'>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'WizardStyle'>;

const WizardStyleScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const { videoUri, prompt, clipCount } = route.params;

  const { setProcessing, setUploadProgress, setCurrentVideo, setError, isProcessing, uploadProgress } = useVideoStore();
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [subtitleColor, setSubtitleColor] = useState('yellow');

  const handleGenerate = async () => {
    try {
      setProcessing(true);
      setError(null);
      
      const repository = new VideoRepositoryImpl();
      const uploadUseCase = new UploadVideoUseCase(repository);

      const video = await uploadUseCase.execute(
        videoUri, 
        (p) => setUploadProgress(p),
        { prompt, clipCount, aspectRatio, subtitleColor }
      );

      setCurrentVideo(video);
      navigation.navigate('Result', { videoId: video.id });
    } catch (err) {
      setError('Failed to process video.');
      Alert.alert('Error', 'Processing failed');
      navigation.navigate('Main'); // Back to home on error
    } finally {
      setProcessing(false);
      setUploadProgress(0);
    }
  };

  if (isProcessing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Creative Magic in Progress... {uploadProgress}%</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${uploadProgress}%` }]} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WizardProgress step={2} />
      
      <View style={styles.card}>
        <Text style={styles.label}>Aspect Ratio</Text>
        <View style={styles.row}>
          {['9:16', '1:1', '16:9'].map(r => (
            <TouchableOpacity 
              key={r}
              style={[styles.btn, aspectRatio === r && styles.activeBtn]}
              onPress={() => setAspectRatio(r)}
            >
              <Text style={[styles.btnText, aspectRatio === r && styles.activeBtnText]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Subtitle Color</Text>
        <View style={styles.row}>
          {['yellow', 'cyan', 'white', 'orange'].map(c => (
            <TouchableOpacity 
              key={c}
              style={[styles.dot, {backgroundColor: c}, subtitleColor === c && styles.activeDot]}
              onPress={() => setSubtitleColor(c)}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate}>
          <Text style={styles.generateText}>Generate Viral Clips</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.xl },
  card: { backgroundColor: Colors.surface, borderRadius: 24, padding: Spacing.lg },
  label: { ...Typography.body, fontWeight: '700', marginBottom: Spacing.sm },
  row: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  btn: { flex: 1, height: 48, borderRadius: 12, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  activeBtn: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  btnText: { color: '#94A3B8' },
  activeBtnText: { color: Colors.text, fontWeight: '700' },
  dot: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: 'transparent' },
  activeDot: { borderColor: Colors.text },
  generateBtn: { height: 56, borderRadius: 16, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  generateText: { fontWeight: '700', color: Colors.text },
  loadingContainer: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  loadingText: { ...Typography.body, marginTop: Spacing.md, fontWeight: '600', color: Colors.text },
  progressBarBg: { height: 6, backgroundColor: Colors.border, borderRadius: 3, width: '100%', marginTop: Spacing.xl, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: Colors.primary },
});

export default WizardStyleScreen;
