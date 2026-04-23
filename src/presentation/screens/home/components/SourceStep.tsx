import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { UploadCloud } from 'lucide-react-native';
import { Colors, Spacing, Typography } from '../../../../core/constants/theme';

interface Props {
  onPick: () => void;
}

export const SourceStep: React.FC<Props> = ({ onPick }) => {
  return (
    <TouchableOpacity onPress={onPick} activeOpacity={0.8}>
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        style={styles.card}
      >
        <UploadCloud color={Colors.text} size={48} />
        <Text style={styles.title}>Pick a Video</Text>
        <Text style={styles.subtitle}>MP4, MOV up to 10 mins</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 260,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  title: {
    ...Typography.h2,
    marginTop: Spacing.md,
    color: Colors.text,
  },
  subtitle: {
    ...Typography.caption,
    marginTop: Spacing.xs,
    color: 'rgba(255,255,255,0.7)',
  },
});
