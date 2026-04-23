import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useVideoPlayer, VideoView } from 'react-native-video';
import { Settings, SkipBack, Play, Pause, SkipForward, Maximize2 } from 'lucide-react-native';
import { Colors } from '../../../../core/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface VideoPreviewProps {
  videoUrl: string;
  thumbnail?: string;
  subtitles?: any[]; // Terima array subtitle lengkap
  activeTextId?: string; // Teks yang sedang diklik user
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ videoUrl, subtitles = [], activeTextId }) => {
  const [currentTime, setCurrentTime] = useState(0);

  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = true;
    p.play();
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

  // Tentukan teks mana yang muncul berdasarkan waktu player
  const displayedText = useMemo(() => {
    // Jika user sedang klik teks tertentu, mungkin kita ingin paksa tampilkan itu (opsional)
    // Tapi untuk hasil yang natural, kita ikuti waktu video:
    return subtitles.find((s: any) => 
      currentTime >= s.time && currentTime <= (s.time + s.duration)
    )?.text;
  }, [subtitles, currentTime]);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.previewContainer}>
        <VideoView
          player={player}
          style={styles.previewImage}
          contentFit="contain" 
        />
        
        {displayedText && (
          <View style={styles.subtitleOverlay}>
            <View style={styles.subtitleCapsule}>
              <Text style={styles.subtitleText}>{displayedText}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Video Navigation Controls */}
      <View style={styles.videoControls}>
        <Settings size={20} color="#64748B" />
        <View style={styles.playIcons}>
           <SkipBack size={24} color="#FFF" />
           <TouchableOpacity 
            style={styles.playBtn} 
            onPress={() => {
              if ((player as any).playing) {
                player.pause();
              } else {
                player.play();
              }
            }}
           >
              <Play size={32} color="#FFF" fill="#FFF" />
           </TouchableOpacity>
           <SkipForward size={24} color="#FFF" />
        </View>
        <Maximize2 size={20} color="#64748B" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: '#000',
    width: '100%',
  },
  previewContainer: { 
    width: '100%', 
    aspectRatio: 1, 
    backgroundColor: '#111', 
    position: 'relative', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: { 
    width: '100%', 
    height: '100%',
    zIndex: 1
  },
  subtitleOverlay: { 
    position: 'absolute', 
    bottom: 30, 
    left: 0, 
    right: 0, 
    alignItems: 'center',
    zIndex: 100,
    elevation: 100,
  },
  subtitleCapsule: { 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)', 
  },
  subtitleText: { 
    color: Colors.primary, 
    fontSize: 16, 
    fontWeight: 'bold', 
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  videoControls: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 20,
    backgroundColor: '#000' 
  },
  playIcons: { flexDirection: 'row', alignItems: 'center', gap: 40 },
  playBtn: { justifyContent: 'center', alignItems: 'center' },
});
