import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Colors, Spacing, Typography } from '../../../core/constants/theme';
import { WizardProgress } from '../home/components/WizardProgress';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'WizardSettings'>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'WizardSettings'>;

const WizardSettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const { videoUri } = route.params;

  const [prompt, setPrompt] = useState('');
  const [clipCount, setClipCount] = useState(3);

  return (
    <ScrollView style={styles.container}>
      <WizardProgress step={1} />

      <View style={styles.card}>
        <Text style={styles.label}>What is this video about?</Text>
        <Text style={styles.hint}>AI will focus on your instructions (e.g: "find gaming moments")</Text>

        <TouchableOpacity
          style={styles.input}
          onPress={() => Alert.prompt("Prompt", "Enter focus instruction", (text) => setPrompt(text))}
        >
          <Text style={{ color: prompt ? Colors.text : '#64748B' }}>
            {prompt || "Type instructions here..."}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

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

        <TouchableOpacity
          style={styles.nextBtn}
          onPress={() => navigation.navigate('WizardStyle', { videoUri, prompt, clipCount })}
        >
          <Text style={styles.nextBtnText}>Next Step: Style</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.xl },
  card: { backgroundColor: Colors.surface, borderRadius: 24, padding: Spacing.lg },
  label: { ...Typography.body, fontWeight: '700', marginBottom: 4 },
  hint: { ...Typography.caption, color: '#64748B', marginBottom: Spacing.md },
  input: { backgroundColor: Colors.background, borderRadius: 12, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xl },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: Spacing.xl },
  row: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  btn: { flex: 1, height: 48, borderRadius: 12, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  activeBtn: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  btnText: { color: '#94A3B8' },
  activeBtnText: { color: Colors.text, fontWeight: '700' },
  nextBtn: { height: 56, borderRadius: 16, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  nextBtnText: { fontWeight: '700', color: Colors.text },
});

export default WizardSettingsScreen;
