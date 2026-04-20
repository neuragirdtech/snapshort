import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Download, Share2, Play } from 'lucide-react-native';
import { VideoClip } from '../../domain/entities/Video';
import { Colors, Spacing, Typography } from '../../core/constants/theme';

interface ClipItemProps {
  clip: VideoClip;
  onPreview: (clip: VideoClip) => void;
  onDownload: (clip: VideoClip) => void;
}

const ClipItem: React.FC<ClipItemProps> = ({ clip, onPreview, onDownload }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.thumbnailContainer} 
        onPress={() => onPreview(clip)}
        activeOpacity={0.9}
      >
        <Image 
          source={{ uri: clip.thumbnail || 'https://via.placeholder.com/150' }} 
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.playOverlay}>
          <Play color={Colors.text} size={28} fill={Colors.text} />
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{Math.floor(clip.duration)}s</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{clip.title}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onDownload(clip)}>
            <Download color={Colors.primary} size={20} />
            <Text style={styles.actionText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Share2 color={Colors.textDim} size={20} />
            <Text style={[styles.actionText, { color: Colors.textDim }]}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  thumbnailContainer: {
    height: 180,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.7,
  },
  playOverlay: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(138, 43, 226, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: Colors.text,
    fontSize: 10,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: Spacing.md,
  },
  title: {
    ...Typography.body,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    marginTop: Spacing.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  actionText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default ClipItem;
