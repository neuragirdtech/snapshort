import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Spacing, Typography } from '../../../../core/constants/theme';

interface Props {
  step: number;
}

export const WizardProgress: React.FC<Props> = ({ step }) => {
  if (step === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step {step + 1} of 3</Text>
      <View style={styles.bar}>
        <View style={[styles.barFill, { width: `${(step + 1) * 33.3}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  title: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: 4,
  },
  bar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    width: 100,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
});
