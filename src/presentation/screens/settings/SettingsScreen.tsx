import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, Modal, Pressable } from 'react-native';
import { Key, Save, ShieldCheck, Cpu, ChevronDown, Check, Sparkles } from 'lucide-react-native';

import { Colors, Spacing, Typography } from '../../../core/constants/theme';
import { useAuthStore, AiProvider } from '../../hooks/useAuthStore';

const SettingsScreen = () => {
  const { activeProvider, apiToken, setAiConfig } = useAuthStore();
  
  const [token, setToken] = useState(apiToken || '');
  const [selectedProvider, setSelectedProvider] = useState<AiProvider>(activeProvider);
  const [modalVisible, setModalVisible] = useState(false);

  const providerOptions: { id: AiProvider, name: string, desc: string, iconColor: string }[] = [
    { id: 'gemini', name: 'Google Gemini', desc: '1.5 Flash - Fastest multimodal processing', iconColor: '#6366F1' },
    { id: 'openai', name: 'ChatGPT (OpenAI)', desc: 'GPT-4o - Most accurate for logic', iconColor: '#10B981' },
    { id: 'claude', name: 'Claude (Anthropic)', desc: 'Claude 3.5 Sonnet - Superior writing & nuances', iconColor: '#D97706' }
  ];

  const handleSave = () => {
    setAiConfig(selectedProvider, token.trim() || null);
    Alert.alert('Settings Updated', `Using ${selectedProvider.toUpperCase()} as your brain.`);
  };

  const getProviderName = (id: AiProvider) => providerOptions.find(o => o.id === id)?.name;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.infoCard}>
          <Sparkles color={Colors.primary} size={32} />
          <Text style={styles.infoTitle}>AI Engine Settings</Text>
          <Text style={styles.infoText}>
            Choose your preferred AI brain and provide its API Token to unlock personalized video processing.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Select AI Provider</Text>
          <TouchableOpacity 
            style={styles.dropdownTrigger} 
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.dropdownValue}>
              <Cpu size={18} color={providerOptions.find(o => o.id === selectedProvider)?.iconColor} />
              <Text style={styles.dropdownText}>{getProviderName(selectedProvider)}</Text>
            </View>
            <ChevronDown size={20} color="#94A3B8" />
          </TouchableOpacity>

          <Text style={styles.label}>Enter {getProviderName(selectedProvider)} Token</Text>
          <View style={styles.inputContainer}>
            <Key size={18} color="#475569" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Paste your API key here..."
              placeholderTextColor="#475569"
              value={token}
              onChangeText={setToken}
              autoCapitalize="none"
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save color="#FFFFFF" size={20} />
          <Text style={styles.saveText}>Apply Configuration</Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          Your token is stored only on this device. If no token is provided, the system's default brain will be used.
        </Text>
      </ScrollView>

      {/* Provider Selector Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Choose Provider</Text>
            
            {providerOptions.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[styles.sheetOption, selectedProvider === opt.id && styles.sheetOptionSelected]}
                onPress={() => {
                  setSelectedProvider(opt.id);
                  setModalVisible(false);
                }}
              >
                <View style={styles.optionInfo}>
                  <Text style={[styles.optionName, selectedProvider === opt.id && styles.optionNameSelected]}>
                    {opt.name}
                  </Text>
                  <Text style={styles.optionDesc}>{opt.desc}</Text>
                </View>
                {selectedProvider === opt.id && <Check size={20} color={Colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F12' },
  content: { padding: 24, paddingBottom: 40 },
  infoCard: {
    backgroundColor: '#16161A',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1F1F23',
  },
  infoTitle: { ...Typography.h2, marginTop: 16, marginBottom: 8 },
  infoText: { ...Typography.body, textAlign: 'center', color: '#94A3B8', lineHeight: 20 },
  section: {
    backgroundColor: '#16161A',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1F1F23',
    marginBottom: 24,
  },
  label: { color: '#94A3B8', fontSize: 12, fontWeight: 'bold', marginBottom: 12, textTransform: 'uppercase' },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F0F12',
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1F1F23',
  },
  dropdownValue: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dropdownText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F0F12',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1F1F23',
    height: 56,
  },
  inputIcon: { marginLeft: 16 },
  input: { flex: 1, color: '#FFFFFF', fontSize: 14, paddingHorizontal: 16 },
  saveButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginLeft: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  bottomSheet: {
    backgroundColor: '#16161A',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
  },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#1F1F23', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetTitle: { ...Typography.h2, textAlign: 'center', marginBottom: 24 },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,
    backgroundColor: '#0F0F12',
    borderWidth: 1,
    borderColor: '#1F1F23',
  },
  sheetOptionSelected: { borderColor: Colors.primary, backgroundColor: 'rgba(99, 102, 241, 0.05)' },
  optionInfo: { flex: 1 },
  optionName: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  optionNameSelected: { color: Colors.primary },
  optionDesc: { color: '#94A3B8', fontSize: 12 },
  footerNote: { ...Typography.caption, textAlign: 'center', color: '#475569', marginTop: 32, paddingHorizontal: 20 },
});

export default SettingsScreen;
