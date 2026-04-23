import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Play, Flame } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Spacing, Typography } from '../../../../core/constants/theme';

interface ClipCardProps {
  item: any;
  onPress: () => void;
}

export const ClipCard: React.FC<ClipCardProps> = ({ item, onPress }) => {
  const thumbUri = item.thumbnail?.split(',')[0] || item.url;
  
  let displaySub = "";
  try {
    const subs = typeof item.subtitles === 'string' ? JSON.parse(item.subtitles) : item.subtitles;
    displaySub = subs[0]?.text || "";
  } catch(e) {}

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: thumbUri }} style={styles.thumbnail} resizeMode="cover" />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.overlayGradient}
        />

        <View style={styles.textOverlayContainer}>
          <Text style={styles.overlayText} numberOfLines={3}>
            {displaySub.toUpperCase()}
          </Text>
        </View>

        <View style={styles.scoreBadge}>
          <Flame size={12} color="#FFF" fill="#FFF" />
          <Text style={styles.scoreBadgeText}>{item.score}</Text>
        </View>

        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{Math.round(item.duration)}s</Text>
        </View>
        
        <View style={styles.playIconOverlay}>
          <Play size={24} color="#FFF" fill="#FFF" opacity={0.6} />
        </View>
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.clipTitle} numberOfLines={1}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 5,
  },
  thumbnailContainer: {
    width: '100%',
    height: 260,
    backgroundColor: '#000',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  overlayGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  textOverlayContainer: {
    ...StyleSheet.absoluteFillObject,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#FFEA00',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    lineHeight: 20,
  },
  scoreBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  playIconOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardInfo: {
    padding: Spacing.sm,
    alignItems: 'center',
  },
  clipTitle: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textDim,
  },
});
