import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Wand2, FileText, Music } from 'lucide-react-native';
import { Colors, Spacing, Typography } from '../../../../core/constants/theme';

export const QuickActions: React.FC = () => {
  const actions = [
    { title: 'Smart Effect', icon: Wand2 },
    { title: 'Script to Video', icon: FileText },
    { title: 'Beat Sync', icon: Music },
  ];

  return (
    <View style={styles.container}>
      {actions.map((action, i) => (
        <TouchableOpacity key={i} style={styles.card}>
          <View style={styles.iconBox}>
            <action.icon size={22} color={Colors.text} />
          </View>
          <Text style={styles.title}>{action.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 24, marginTop: 40 },
  card: { flex: 1, height: 110, backgroundColor: '#222226', borderRadius: 24, justifyContent: 'center', alignItems: 'center', padding: Spacing.sm, borderWidth: 1, borderColor: '#333' },
  iconBox: { marginBottom: 10 },
  title: { ...Typography.caption, color: '#E2E8F0', textAlign: 'center', fontSize: 12, fontWeight: '700' },
});
