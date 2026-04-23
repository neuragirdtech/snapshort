import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Colors, Spacing, Typography } from '../../../../core/constants/theme';

interface Props {
  prompt: string;
  setPrompt: (t: string) => void;
  clipCount: number;
  setClipCount: (c: number) => void;
  onNext: () => void;
  onCancel: () => void;
}

export const SettingsStep: React.FC<Props> = ({ 
  prompt, setPrompt, clipCount, setClipCount, onNext, onCancel 
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>What is this video about?</Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={styles.mockInput} 
          onPress={() => Alert.prompt("Prompt", "Enter instructions", (text) => setPrompt(text))}
        >
          <Text style={{color: prompt ? Colors.text : '#64748B'}}>
            {prompt || "e.g: find funny moments..."}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>How many clips? ({clipCount})</Text>
      <View style={styles.row}>
        {[1, 3, 5].map(c => (
          <TouchableOpacity 
            key={c}
            style={[styles.btn, clipCount === c && styles.activeBtn]}
            onPress={() => setClipCount(c)}
          >
            <Text style={[styles.btnText, clipCount === c && styles.activeBtnText]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.nextBtn} onPress={onNext}>
        <Text style={styles.nextBtnText}>Next Step: Style</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
        <Text style={{color: '#64748B'}}>Cancel</Text>
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
  label: {
    ...Typography.body,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    marginBottom: Spacing.xl,
  },
  mockInput: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
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
  activeBtn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  btnText: { color: '#94A3B8' },
  activeBtnText: { color: Colors.text, fontWeight: '700' },
  nextBtn: {
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtnText: { fontWeight: '700', color: Colors.text },
  cancelBtn: { marginTop: 16, alignSelf: 'center' },
});
