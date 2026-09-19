import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

const checklistItems = [
  'Conferi o beneficiário no banco',
  'O valor confere com o combinado',
  'Não foi pedido senha ou código',
] as const;

export function ConfirmationChecklist() {
  const [checkedItems, setCheckedItems] = useState(() => checklistItems.map(() => false));
  const isComplete = checkedItems.every(Boolean);

  const toggleItem = (index: number) => {
    setCheckedItems((current) =>
      current.map((checked, itemIndex) => (itemIndex === index ? !checked : checked)),
    );
  };

  return (
    <View style={styles.card} accessible accessibilityRole="text">
      <View style={styles.header}>
        <Ionicons name="checkbox-outline" size={22} color={colors.emerald} />
        <Text allowFontScaling style={styles.title}>Checklist antes de pagar</Text>
      </View>

      <View style={styles.items}>
        {checklistItems.map((item, index) => {
          const checked = checkedItems[index] ?? false;

          return (
            <Pressable
              key={item}
              accessibilityRole="checkbox"
              accessibilityLabel={item}
              accessibilityState={{ checked }}
              onPress={() => toggleItem(index)}
              style={({ pressed }) => [styles.item, pressed && styles.pressed]}
            >
              <Ionicons
                name={checked ? 'checkmark-circle' : 'ellipse-outline'}
                size={23}
                color={checked ? colors.emerald : colors.textMuted}
              />
              <Text allowFontScaling style={[styles.itemText, checked && styles.checkedText]}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {isComplete ? (
        <Text allowFontScaling style={styles.completeText}>
          Conferência concluída. Ainda confirme no banco antes de pagar.
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 20,
    backgroundColor: '#122A2A',
    borderWidth: 1,
    borderColor: '#20504A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    color: colors.emerald,
    fontSize: 16,
    fontWeight: '900',
  },
  items: {
    gap: spacing.sm,
  },
  item: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: 12,
  },
  pressed: {
    opacity: 0.75,
  },
  itemText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 21,
  },
  checkedText: {
    color: colors.emerald,
    fontWeight: '700',
  },
  completeText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
});
