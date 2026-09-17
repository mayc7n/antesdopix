import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { RiskBadge } from '@/components/RiskBadge';
import { SignalCard } from '@/components/SignalCard';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useAnalysisStore } from '@/state/analysisStore';

export default function ResultScreen() {
  const router = useRouter();
  const analysis = useAnalysisStore((state) => state.currentAnalysis);
  const clearAnalysis = useAnalysisStore((state) => state.clearAnalysis);

  if (!analysis) {
    router.replace('/');
    return null;
  }

  const handleNewAnalysis = () => {
    clearAnalysis();
    router.replace('/');
  };

  const handleShareSummary = () => {
    const summary = [
      'Antes do Pix — resumo da análise',
      `Classificação: ${analysis.result.level}`,
      '',
      ...analysis.result.signals.map((signal) => `• ${signal.title}`),
      '',
      'Este resultado não garante que o pagamento seja seguro. Confirme o beneficiário no aplicativo do seu banco.',
    ].join('\n');

    void Share.share({ message: summary });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text allowFontScaling style={styles.eyebrow}>RESULTADO LOCAL</Text>
        <Text allowFontScaling style={styles.title}>Uma pausa pode proteger você</Text>
        <RiskBadge level={analysis.result.level} />

        <View style={styles.messageCard}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.coral} />
          <Text allowFontScaling style={styles.message}>{analysis.result.message}</Text>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text allowFontScaling style={styles.sectionEyebrow}>POR QUE APARECEU ISSO?</Text>
            <Text allowFontScaling style={styles.sectionTitle}>Sinais encontrados</Text>
          </View>
          <View style={styles.countPill}>
            <Text allowFontScaling style={styles.count}>{analysis.result.signals.length}</Text>
          </View>
        </View>

        {analysis.result.signals.length > 0 ? (
          analysis.result.signals.map((signal) => <SignalCard key={signal.code} signal={signal} />)
        ) : (
          <View style={styles.emptySignals}>
            <Ionicons name="search-outline" size={22} color={colors.emerald} />
            <Text allowFontScaling style={styles.emptyText}>Nenhum sinal conhecido foi encontrado nesta análise.</Text>
          </View>
        )}

        <View style={styles.limitationsCard}>
          <Text allowFontScaling style={styles.limitationsTitle}>Importante</Text>
          {analysis.result.limitations.map((limitation) => (
            <View key={limitation} style={styles.limitationRow}>
              <Ionicons name="information-circle-outline" size={18} color={colors.textSecondary} />
              <Text allowFontScaling style={styles.limitation}>{limitation}</Text>
            </View>
          ))}
        </View>

        <AppButton
          label="Compartilhar resumo"
          icon="share-social-outline"
          variant="secondary"
          onPress={handleShareSummary}
        />
        <AppButton label="Fazer nova análise" icon="refresh-outline" onPress={handleNewAnalysis} />
        <AppButton
          label="Denunciar golpe"
          icon="megaphone-outline"
          variant="secondary"
          onPress={() => router.push('/report')}
        />
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
  messageCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 22,
    backgroundColor: '#322338',
    borderWidth: 1,
    borderColor: '#633A4B',
  },
  message: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 17,
    lineHeight: 25,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  sectionEyebrow: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
  },
  countPill: {
    minWidth: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  count: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '900',
  },
  emptySignals: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
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
  limitationsCard: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  limitationsTitle: {
    color: colors.amber,
    fontSize: 16,
    fontWeight: '900',
  },
  limitationRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  limitation: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
