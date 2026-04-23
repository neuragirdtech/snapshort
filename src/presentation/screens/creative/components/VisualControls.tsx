import React, { useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, PanResponder, Dimensions } from 'react-native';
import { Colors } from '../../../../core/constants/theme';
import { Smartphone, Square, Monitor } from 'lucide-react-native';

interface VisualControlsProps {
  realism: number; setRealism: (v: number) => void;
  motion: string; setMotion: (v: string) => void;
  aspectRatio: string; setAspectRatio: (v: string) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDER_WIDTH = SCREEN_WIDTH - 40;

export const VisualControls: React.FC<VisualControlsProps> = (props) => {
  const { realism, motion, aspectRatio, setAspectRatio, setRealism } = props;

  // Realism PanResponder
  const realismPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newValue = Math.min(Math.max(0, (gestureState.moveX - 20) / SLIDER_WIDTH * 100), 100);
        setRealism(Math.round(newValue));
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {/* Aspect Ratio */}
      <Text style={styles.controlLabel}>Aspect Ratio</Text>
      <View style={styles.ratioRow}>
        {[
          { label: '9:16', value: '9:16', Icon: Smartphone },
          { label: '1:1', value: '1:1', Icon: Square },
          { label: '16:9', value: '16:9', Icon: Monitor },
        ].map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[styles.ratioBtn, aspectRatio === item.value && styles.activeRatio]}
            onPress={() => setAspectRatio(item.value)}
          >
            <item.Icon size={20} color={aspectRatio === item.value ? '#FFF' : '#64748B'} />
            <Text style={[styles.ratioText, aspectRatio === item.value && styles.activeRatioText]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Realism Slider */}
      <Text style={styles.controlLabel}>Realism Level: {realism}%</Text>
      <View style={styles.sliderRow} {...realismPan.panHandlers}>
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: `${realism}%`, backgroundColor: Colors.primary }]} />
          <View style={[styles.sliderThumb, { left: `${realism}%`, backgroundColor: Colors.primary }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  controlLabel: { color: '#FFF', fontSize: 13, fontWeight: '600', marginBottom: 12, marginTop: 16 },
  ratioRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  ratioBtn: { flex: 1, height: 60, backgroundColor: '#1A1A1D', borderRadius: 16, justifyContent: 'center', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: '#2C2C2E' },
  activeRatio: { borderColor: Colors.primary, backgroundColor: '#2C2C2E' },
  ratioText: { color: '#64748B', fontSize: 12, fontWeight: 'bold' },
  activeRatioText: { color: '#FFF' },
  sliderRow: { height: 40, justifyContent: 'center', width: '100%', marginBottom: 10 },
  sliderTrack: { height: 6, backgroundColor: '#1E1E1E', borderRadius: 3, width: '100%', position: 'relative' },
  sliderFill: { height: '100%', borderRadius: 3 },
  sliderThumb: { width: 22, height: 22, borderRadius: 11, position: 'absolute', top: -8, marginLeft: -11, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 2, elevation: 3 },
  segmentedControl: { flexDirection: 'row', backgroundColor: '#101012', borderRadius: 16, padding: 4, gap: 4, marginBottom: 20 },
  motionBtn: { flex: 1, height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  activeMotion: { backgroundColor: '#1E1E1E', borderWidth: 1, borderColor: Colors.primary },
  motionText: { color: '#64748B', fontWeight: '600', fontSize: 13 },
  activeMotionText: { color: '#FFF' },
});
