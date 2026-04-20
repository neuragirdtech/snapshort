import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { SlidersHorizontal, SkipBack, Play, Pause, SkipForward, Maximize } from 'lucide-react-native';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const PlaybackControls = ({ isPlaying, onTogglePlay, onNext, onPrev }: PlaybackControlsProps) => {
  return (
    <View style={styles.controlsRow}>
      <TouchableOpacity>
        <SlidersHorizontal color="#FFFFFF" size={24} />
      </TouchableOpacity>
      
      <View style={styles.centerControls}>
        <TouchableOpacity style={styles.controlIcon} onPress={onPrev}>
          <SkipBack color="#FFFFFF" size={22} fill="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.playButton}
          onPress={onTogglePlay}
        >
          {isPlaying ? (
            <Pause color="#FFFFFF" size={28} fill="white" />
          ) : (
            <Play color="#FFFFFF" size={28} fill="white" />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlIcon} onPress={onNext}>
          <SkipForward color="#FFFFFF" size={22} fill="white" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Maximize color="#FFFFFF" size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  centerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlIcon: {
    marginHorizontal: 15,
  },
  playButton: {
    marginHorizontal: 10,
  },
});
