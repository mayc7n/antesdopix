import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import type { RiskSignal } from '@/domain/analysis/types';

const signalIcons: Record<RiskSignal['code'], keyof typeof Ionicons.glyphMap> = {
  urgencia: 'timer-outline',
  premio: 'gift-outline',
  pedidoDeSegredo: 'lock-closed-outline',
  dominioEstranho: 'link-outline',
  linkInseguro: 'globe-outline',
  chaveInvalida: 'key-outline',
  pressaoEmocional: 'heart-dislike-outline',
};

interface SignalCardProps {
  signal: RiskSignal;
}

export function SignalCard({ signal }: SignalCardProps) {
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${signal.title}. ${signal.explanation}`}
      style={styles.card}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={signalIcons[signal.code]} size={21} color={colors.amber} />
      </View>
      <View style={styles.copy}>
        <Text allowFontScaling style={styles.title}>
          {signal.title}
        </Text>
        <Text allowFontScaling style={styles.explanation}>
          {signal.explanation}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3A2F20',
  },
  copy: {
    flex: 1,
    gap: 5,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '800',
  },
  explanation: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 21,
  },
});
