import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Type } from 'lucide-react-native';
import { Colors } from '../../../../core/constants/theme';
import { ApiConfig } from '../../../../core/constants/api';

const { width } = Dimensions.get('window');

interface TimelineProps {
  videoData: any;
  currentTime: number;
  onSelectClip: (url: string) => void;
}

export const Timeline = ({ videoData, currentTime, onSelectClip }: TimelineProps) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const renderTimelineRuler = () => {
    const segments = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return (
      <View style={styles.rulerContainer}>
        {segments.map((s) => (
          <View key={s} style={styles.rulerSegment}>
            <Text style={styles.rulerText}>{s}s</Text>
            <View style={styles.rulerTicks}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.tick, i === 0 && styles.longTick]} />
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.timelineArea}>
      {renderTimelineRuler()}
      
      <ScrollView 
        ref={scrollViewRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.tracksContainer}>
          {/* Text Track */}
          <View style={styles.trackRow}>
            <View style={[styles.textTrack, { width: width * 0.4, borderColor: Colors.primary }]}>
              <Type color={Colors.primary} size={14} />
              <Text style={styles.trackContentText} numberOfLines={1}>Silence before the de..</Text>
            </View>
          </View>

          {/* Video Track */}
          <View style={styles.videoTrackRow}>
            {videoData?.clips && videoData.clips.length > 0 ? (
              videoData.clips.map((clip: any, index: number) => (
                <React.Fragment key={clip.id}>
                  <TouchableOpacity 
                    onPress={() => onSelectClip(`${ApiConfig.BASE_URL}/${clip.url}`)}
                  >
                    <Image 
                      source={{ uri: `${ApiConfig.BASE_URL}/${clip.url}` }} 
                      style={styles.videoThumbnail} 
                    />
                    <View style={styles.scoreBadge}>
                      <Text style={styles.scoreText}>{clip.score}</Text>
                    </View>
                  </TouchableOpacity>
                  {index < videoData.clips.length - 1 && (
                    <View style={styles.transitionIcon}>
                       <Text style={{color: '#FFF', fontSize: 10}}>⋈</Text>
                    </View>
                  )}
                </React.Fragment>
              ))
            ) : (
              <View style={[styles.videoThumbnail, { backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: '#888', fontSize: 10 }}>No Clips</Text>
              </View>
            )}
          </View>

          {/* Audio Track */}
          <View style={styles.audioTrack}>
            <View style={styles.waveform}>
              {[...Array(40)].map((_, i) => (
                <View key={i} style={[styles.waveBar, { height: Math.random() * 20 + 5 }]} />
              ))}
            </View>
          </View>

          {/* Playhead (Garis yang berjalan) */}
          <View 
            style={[
              styles.playhead, 
              { transform: [{ translateX: (currentTime * 60) }] }
            ]} 
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  timelineArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  rulerContainer: {
    flexDirection: 'row',
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingLeft: 20,
  },
  rulerSegment: { width: 60 },
  rulerText: { color: '#888888', fontSize: 10, marginBottom: 4 },
  rulerTicks: { flexDirection: 'row', alignItems: 'flex-end' },
  tick: { width: 1, height: 5, backgroundColor: '#444444', marginRight: 11 },
  longTick: { height: 10, backgroundColor: '#888888' },
  tracksContainer: { paddingLeft: 20, paddingRight: 100, paddingVertical: 10 },
  trackRow: { flexDirection: 'row', marginBottom: 10 },
  textTrack: {
    height: 36, backgroundColor: '#1A1A1A', borderRadius: 18, borderWidth: 1,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, marginRight: 10,
  },
  trackContentText: { color: '#FFFFFF', fontSize: 12, marginLeft: 8 },
  videoTrackRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  videoThumbnail: { width: 100, height: 60, borderRadius: 12 },
  transitionIcon: {
    width: 20, height: 20, borderRadius: 10, backgroundColor: '#333333',
    justifyContent: 'center', alignItems: 'center', marginHorizontal: 4, borderWidth: 1, borderColor: '#555555'
  },
  scoreBadge: {
    position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)'
  },
  scoreText: { color: '#C6F432', fontSize: 10, fontWeight: 'bold' },
  audioTrack: { height: 50, backgroundColor: '#1A1A1A', borderRadius: 12, justifyContent: 'center', paddingHorizontal: 10 },
  waveform: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  waveBar: { width: 2, backgroundColor: '#888888', borderRadius: 1 },
  playhead: {
    position: 'absolute', left: 20, top: 0, bottom: 0, width: 2, backgroundColor: '#FFFFFF', zIndex: 10
  },
});
