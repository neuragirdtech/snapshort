import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Sparkles, Mic } from 'lucide-react-native';
import { Colors, Typography } from '../../../../core/constants/theme';

interface PromptCardProps {
  prompt: string;
  setPrompt: (text: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, setPrompt }) => {
  return (
    <View style={styles.promptCard}>
      <TextInput
        style={styles.promptInput}
        value={prompt}
        onChangeText={setPrompt}
        multiline
        placeholderTextColor="#64748B"
      />
      <View style={styles.promptActions}>
        <TouchableOpacity style={styles.enhanceBtn}>
          <Sparkles size={16} color={Colors.primary} />
          <Text style={styles.enhanceText}>Enhance Prompt</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.micBtn}>
          <Mic size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  promptCard: { backgroundColor: '#1A1A1D', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#2C2C2E', minHeight: 240, position: 'relative' },
  promptInput: { ...Typography.body, color: '#E2E8F0', lineHeight: 24, marginBottom: 40 },
  promptActions: { flexDirection: 'row', justifyContent: 'center', gap: 12, position: 'absolute', bottom: 20, left: 20, right: 20 },
  enhanceBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#2C2C2E', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 100, borderWidth: 1, borderColor: '#333' },
  enhanceText: { color: Colors.primary, fontWeight: '600', fontSize: 13 },
  micBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#2C2C2E', justifyContent: 'center', alignItems: 'center' },
});
