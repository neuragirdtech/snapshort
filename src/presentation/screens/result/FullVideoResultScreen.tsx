import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Share, Dimensions, ActivityIndicator } from 'react-native';
import { useVideoPlayer, VideoView } from 'react-native-video';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ChevronLeft, Download, Share2, Sparkles, CheckCircle2, Scissors } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { VideoApi } from '../../../data/api/VideoApi';
import { Colors, Typography, Spacing } from '../../../core/constants/theme';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  FullVideoResult: { videoId: string; videoUrl: string; title: string };
};

type ScreenRouteProp = RouteProp<RootStackParamList, 'FullVideoResult'>;

const FullVideoResultScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ScreenRouteProp>();
  const { videoId, videoUrl, title } = route.params;

  const [currentTime, setCurrentTime] = useState(0);

  // 1. Ambil data lengkap dari BE (termasuk subtitle)
  const { data: videoDetail } = useQuery({
    queryKey: ['video-detail', videoId],
    queryFn: () => VideoApi.getVideoDetail(videoId),
  });

  // 2. Gabungkan semua subtitle dari semua klip
  const allSubtitles = useMemo(() => {
    if (!videoDetail?.clips) return [];
    return videoDetail.clips.flatMap(clip => {
      try {
        const subs = JSON.parse(clip.subtitles || '[]');
        return subs.map((s: any) => ({
          ...s,
          startTime: (clip as any).startTime + s.time,
          endTime: (clip as any).startTime + s.time + s.duration
        }));
      } catch (e) {
        return [];
      }
    });
  }, [videoDetail]);

  // 3. Tentukan subtitle mana yang harus muncul sekarang
  const activeSubtitle = allSubtitles.find(
    s => currentTime >= s.startTime && currentTime <= s.endTime
  );

  // Initialize Video Player v6
  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    player.play();
  });

  // Pantau waktu video secara real-time
  useEffect(() => {
    const interval = setInterval(() => {
      if (player && player.currentTime !== undefined) {
        setCurrentTime(player.currentTime);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [player]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my AI edited video: ${title}`,
        url: videoUrl,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
          <View style={styles.badge}>
            <Sparkles size={10} color={Colors.primary} fill={Colors.primary} />
            <Text style={styles.badgeText}>AI EDITED</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
          <Share2 size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Video Player v6 */}
      <View style={styles.videoWrapper}>
        <VideoView
          player={player}
          style={styles.video}
          contentFit="contain"
          allowsFullscreen
          allowsPictureInPicture
        />
        
        {/* Subtitle Overlay */}
        {activeSubtitle && (
          <View style={styles.subtitleContainer}>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)', 'transparent']}
              style={styles.subtitleBg}
            >
              <Text style={styles.subtitleText}>{activeSubtitle.text}</Text>
            </LinearGradient>
          </View>
        )}
      </View>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <View style={styles.successMessage}>
          <CheckCircle2 size={20} color={Colors.success} />
          <Text style={styles.successText}>Your AI masterpiece is ready!</Text>
        </View>

        <TouchableOpacity 
          style={styles.editBtn} 
          onPress={() => navigation.navigate('Editor', { videoId })}
        >
          <Scissors size={22} color={Colors.primary} />
          <Text style={styles.editBtnText}>Fine-tune Edits</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.8}>
          <LinearGradient
            colors={[Colors.primary, Colors.secondary]}
            style={styles.gradientBtn}
          >
            <Download size={24} color="#FFF" />
            <Text style={styles.btnText}>Download to Gallery</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backHomeBtn} 
          onPress={() => navigation.navigate('Home' as never)}
        >
          <Text style={styles.backHomeText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    gap: 15,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: { flex: 1 },
  headerTitle: { ...Typography.h3, color: '#FFF', fontWeight: 'bold' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  badgeText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  videoWrapper: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#050505',
    marginVertical: 10,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  footer: {
    padding: 20,
    paddingBottom: 50,
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    paddingVertical: 12,
    borderRadius: 16,
  },
  successText: {
    color: Colors.success,
    fontWeight: '600',
    fontSize: 14,
  },
  downloadBtn: {
    width: '100%',
    height: 64,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
  },
  gradientBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  btnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backHomeBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  backHomeText: {
    color: Colors.textDim,
    fontSize: 16,
    fontWeight: '600',
  },
  editBtn: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  editBtnText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitleContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  subtitleBg: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  subtitleText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default FullVideoResultScreen;
