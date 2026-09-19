import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export type ButtonVariant = 'primary' | 'secondary' | 'quiet';

interface AppButtonStyleOptions {
  variant: ButtonVariant;
  pressed: boolean;
  disabled: boolean;
  reducedMotion: boolean;
}

export function getAppButtonStyles({
  variant,
  pressed,
  disabled,
  reducedMotion,
}: AppButtonStyleOptions) {
  const isPrimary = variant === 'primary';
  const isQuiet = variant === 'quiet';

  return [
    styles.button,
    isPrimary && styles.primaryButton,
    variant === 'secondary' && styles.secondaryButton,
    isQuiet && styles.quietButton,
    pressed && !disabled && !reducedMotion && styles.pressed,
    disabled && styles.disabled,
  ];
}

interface AppButtonProps {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  accessibilityHint?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
}

export function AppButton({
  label,
  onPress,
  icon,
  accessibilityHint,
  variant = 'primary',
  disabled = false,
}: AppButtonProps) {
  const isPrimary = variant === 'primary';
  const isQuiet = variant === 'quiet';
  const reducedMotion = useReducedMotion();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) =>
        getAppButtonStyles({ variant, pressed, disabled, reducedMotion })
      }
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={20}
          color={isPrimary ? colors.background : colors.textPrimary}
        />
      ) : null}
      <Text
        allowFontScaling
        style={[styles.label, isPrimary ? styles.primaryLabel : styles.secondaryLabel]}
      >
        {label}
      </Text>
      {icon ? <View style={styles.labelSpacer} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.coral,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quietButton: {
    minHeight: 48,
    backgroundColor: 'transparent',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  primaryLabel: {
    color: colors.background,
  },
  secondaryLabel: {
    color: colors.textPrimary,
  },
  labelSpacer: {
    width: 20,
  },
});
