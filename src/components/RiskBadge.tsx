import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import type { RiskLevel } from '@/domain/analysis/types';

const levelConfig: Record<
  RiskLevel,
  { title: string; icon: keyof typeof Ionicons.glyphMap; color: string }
> = {
  baixoRisco: { title: 'Poucos sinais encontrados', icon: 'shield-checkmark-outline', color: colors.emerald },
  atencao: { title: 'Atenção antes de continuar', icon: 'alert-circle-outline', color: colors.amber },
  possivelGolpe: { title: 'Possível golpe', icon: 'warning-outline', color: colors.coral },
};

interface RiskBadgeProps {
  level: RiskLevel;
}

export function RiskBadge({ level }: RiskBadgeProps) {
  const config = levelConfig[level];

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${config.title}. O resultado não garante segurança.`}
      style={[styles.badge, { borderColor: config.color }]}
    >
      <Ionicons name={config.icon} size={22} color={config.color} />
      <Text allowFontScaling style={[styles.label, { color: config.color }]}>
        {config.title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.surface,
  },
  label: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
  },
});
