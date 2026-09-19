import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import type { NextStep } from '@/domain/analysis/nextSteps';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface NextStepsCardProps {
  steps: readonly NextStep[];
}

export function NextStepsCard({ steps }: NextStepsCardProps) {
  return (
    <View style={styles.card} accessible accessibilityRole="text">
      <View style={styles.header}>
        <Ionicons name="footsteps-outline" size={22} color={colors.amber} />
        <Text allowFontScaling style={styles.title}>O que fazer agora</Text>
      </View>
      <View style={styles.steps}>
        {steps.map((step) => (
          <View key={step.title} style={styles.step}>
            <View style={styles.bullet} />
            <View style={styles.copy}>
              <Text allowFontScaling style={styles.stepTitle}>{step.title}</Text>
              <Text allowFontScaling style={styles.description}>{step.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 20,
    backgroundColor: '#2C2417',
    borderWidth: 1,
    borderColor: '#5B4724',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    color: colors.amber,
    fontSize: 16,
    fontWeight: '900',
  },
  steps: {
    gap: spacing.sm,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  bullet: {
    width: 7,
    height: 7,
    marginTop: 7,
    borderRadius: 4,
    backgroundColor: colors.amber,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  stepTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '800',
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
