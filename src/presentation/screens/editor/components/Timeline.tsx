import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Type, Shuffle } from 'lucide-react-native';
import { Colors } from '../../../../core/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PIXELS_PER_SECOND = 40; 

interface TimelineProps {
  clips: any[];
  activeIndex: number;
  activeTextId?: string;
  onClipClick: (index: number) => void;
  onTextClick: (textId: string, clipIndex: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ 
  clips, 
  activeIndex, 
  activeTextId,
  onClipClick, 
  onTextClick 
}) => {
  return (
    <View style={styles.timelineArea}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        removeClippedSubviews={false}
      >
        <View style={styles.rail}>
            {/* Track 1: Multi-Entry Captions */}
            <View style={styles.track}>
              {clips.map((clip, idx) => {
                let clipSubtitles: any[] = [];
                try {
                  clipSubtitles = typeof clip.subtitles === 'string' ? JSON.parse(clip.subtitles) : (clip.subtitles || []);
                } catch(e){}

                const clipWidth = Math.max(80, (clip.duration || 5) * PIXELS_PER_SECOND);

                return (
                  <View key={`text-track-${idx}`} style={[styles.clipTextTrack, { width: clipWidth }]}>
                    {clipSubtitles.map((sub: any, subIdx: number) => {
                      const subWidth = (sub.duration || 2) * PIXELS_PER_SECOND;
                      const subLeft = (sub.time || 0) * PIXELS_PER_SECOND;
                      
                      const uniqueId = sub.id || `sub-${idx}-${subIdx}`;
                      const isActive = activeTextId === uniqueId;

                      return (
                        <TouchableOpacity 
                          key={`text-${uniqueId}`} 
                          onPress={() => onTextClick(uniqueId, idx)}
                          style={[
                            styles.textSegment, 
                            { width: subWidth, left: subLeft },
                            isActive && styles.activeText
                          ]}
                        >
                          <Type size={10} color={isActive ? Colors.primary : "#FFF"} />
                          <Text style={styles.capText} numberOfLines={1}>{sub.text}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                );
              })}
            </View>

            {/* Track 2: Video Filmstrip */}
            <View style={[styles.track, { marginTop: 15 }]}>
              {clips.map((clip, idx) => {
                const clipWidth = Math.max(80, (clip.duration || 5) * PIXELS_PER_SECOND);
                const film = (clip.filmstrip && clip.filmstrip.length > 0) ? clip.filmstrip : [clip.thumbnail || clip.url];

                return (
                  <View key={`vid-group-${idx}`} style={styles.clipGroup}>
                    <TouchableOpacity 
                      onPress={() => onClipClick(idx)}
                      activeOpacity={1}
                      style={[styles.clipBase, { width: clipWidth }]}
                    >
                      <View style={styles.strip}>
                        {film.map((img: string, i: number) => (
                          <Image key={`f-${idx}-${i}`} source={{ uri: img }} style={styles.frame} fadeDuration={150} />
                        ))}
                      </View>
                      
                      {idx === activeIndex && (
                        <View style={styles.selectionOverlay} />
                      )}
                    </TouchableOpacity>

                    {idx < clips.length - 1 && (
                      <View style={styles.transBox}>
                        <View style={styles.transCircle}>
                          <Shuffle size={10} color="#000" />
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  timelineArea: { height: 160, backgroundColor: '#000', paddingHorizontal: 15 },
  scrollContent: { paddingVertical: 10, paddingRight: 100 },
  rail: { flexDirection: 'column' },
  track: { flexDirection: 'row', alignItems: 'center' },
  clipTextTrack: { 
    height: 30, 
    position: 'relative',
    marginRight: 16,
  },
  textSegment: { 
    height: 28, 
    backgroundColor: '#1A1A1A', 
    borderRadius: 4, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 8, 
    gap: 4,
    position: 'absolute',
    top: 0,
    borderWidth: 1,
    borderColor: '#333',
  },
  activeText: {
    borderColor: Colors.primary,
    backgroundColor: '#222',
  },
  capText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  clipGroup: { flexDirection: 'row', alignItems: 'center' },
  clipBase: { height: 60, backgroundColor: '#111', borderRadius: 6, overflow: 'hidden', position: 'relative' },
  strip: { flexDirection: 'row', flex: 1 },
  frame: { flex: 1, height: '100%', resizeMode: 'cover' },
  selectionOverlay: { 
    ...StyleSheet.absoluteFill, 
    borderWidth: 2, 
    borderColor: Colors.primary, 
    backgroundColor: 'rgba(255, 59, 48, 0.1)' 
  },
  transBox: { width: 16, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  transCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
});
