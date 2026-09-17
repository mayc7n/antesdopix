import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { SignalCode } from '@/domain/analysis/types';
import { AppButton } from '@/components/AppButton';
import { SignalCard } from '@/components/SignalCard';
import { useAnalysisStore } from '@/state/analysisStore';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

const signalActions: Record<SignalCode, string> = {
  urgencia: 'O que fazer: pare e confirme a cobrança por um canal conhecido.',
  premio: 'O que fazer: desconfie de benefícios inesperados e não pague para receber um prêmio.',
  pedidoDeSegredo: 'O que fazer: nunca informe senha, token, código SMS ou biometria.',
  dominioEstranho: 'O que fazer: confira o endereço letra por letra e procure a empresa por um canal oficial.',
  linkInseguro: 'O que fazer: não abra o link e acesse o serviço pelo aplicativo ou endereço oficial.',
  chaveInvalida: 'O que fazer: peça a chave novamente e confira o formato antes de continuar.',
  pressaoEmocional: 'O que fazer: respire, não esconda a operação e converse com alguém de confiança.',
};

export default function DetailsScreen() {
  const router = useRouter();
  const analysis = useAnalysisStore((state) => state.currentAnalysis);

  if (!analysis) {
    router.replace('/');
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text allowFontScaling style={styles.eyebrow}>ENTENDA O ALERTA</Text>
        <Text allowFontScaling style={styles.title}>Detalhes dos sinais</Text>
        <Text allowFontScaling style={styles.intro}>
          Estes sinais não provam que houve um golpe. Eles mostram o que merece uma conferência mais cuidadosa.
        </Text>

        {analysis.result.signals.length > 0 ? (
          analysis.result.signals.map((signal) => (
            <View key={signal.code} style={styles.signalGroup}>
              <SignalCard signal={signal} />
              <View style={styles.actionCard} accessible accessibilityRole="text">
                <Ionicons name="checkmark-circle-outline" size={20} color={colors.emerald} />
                <Text allowFontScaling style={styles.actionText}>{signalActions[signal.code]}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard} accessible accessibilityRole="text">
            <Ionicons name="search-outline" size={22} color={colors.emerald} />
            <Text allowFontScaling style={styles.emptyText}>
              Nenhum sinal conhecido foi encontrado. Mesmo assim, confirme o beneficiário no aplicativo do seu banco.
            </Text>
          </View>
        )}

        <View style={styles.reminderCard} accessible accessibilityRole="text">
          <Ionicons name="shield-checkmark-outline" size={22} color={colors.amber} />
          <Text allowFontScaling style={styles.reminderText}>
            O Antes do Pix orienta você, mas não acessa sua conta e não garante que o pagamento seja seguro.
          </Text>
        </View>

        <AppButton label="Voltar para o resultado" icon="arrow-back-outline" onPress={() => router.replace('/result')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  eyebrow: {
    color: colors.coral,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginTop: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
  },
  intro: {
    color: colors.textSecondary,
    fontSize: 17,
    lineHeight: 25,
  },
  signalGroup: {
    gap: spacing.xs,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    backgroundColor: '#122A2A',
    borderWidth: 1,
    borderColor: '#20504A',
  },
  actionText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
  },
  emptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 18,
    backgroundColor: '#122A2A',
    borderWidth: 1,
    borderColor: '#20504A',
  },
  emptyText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 21,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reminderText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
  },
});
