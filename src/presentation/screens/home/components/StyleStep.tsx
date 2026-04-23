import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography } from '../../../../core/constants/theme';

interface Props {
  aspectRatio: string;
  setAspectRatio: (r: string) => void;
  subtitleColor: string;
  setSubtitleColor: (c: string) => void;
  onGenerate: () => void;
  onBack: () => void;
}

export const StyleStep: React.FC<Props> = ({ 
  aspectRatio, setAspectRatio, subtitleColor, setSubtitleColor, onGenerate, onBack 
}) => {
  return (
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

      <TouchableOpacity style={styles.generateBtn} onPress={onGenerate}>
        <Text style={styles.generateBtnText}>Generate Shorts</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={{color: '#64748B'}}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  label: { ...Typography.body, fontWeight: '700', marginBottom: Spacing.sm },
  row: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeBtn: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  btnText: { color: '#94A3B8' },
  activeBtnText: { color: Colors.text, fontWeight: '700' },
  dot: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: 'transparent' },
  activeDot: { borderColor: Colors.text },
  generateBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  generateBtnText: { fontWeight: '700', color: Colors.text },
  backBtn: { marginTop: 16, alignSelf: 'center' },
});
