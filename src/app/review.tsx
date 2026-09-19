import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useAnalysisStore } from '@/state/analysisStore';

const typeLabels = {
  mensagem: 'Mensagem',
  link: 'Link',
  telefone: 'Telefone',
  chavePix: 'Chave Pix',
  qrCode: 'QR Code',
} as const;

const formatPixValue = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export default function ReviewScreen() {
  const router = useRouter();
  const analysis = useAnalysisStore((state) => state.currentAnalysis);

  useEffect(() => {
    if (!analysis) {
      router.replace('/');
    }
  }, [analysis, router]);

  if (!analysis) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text allowFontScaling style={styles.eyebrow}>CONFIRA OS DADOS</Text>
        <Text allowFontScaling style={styles.title}>Foi isso que encontramos</Text>
        <Text allowFontScaling style={styles.description}>
          Confira se os dados abaixo fazem sentido para você. Ainda não iniciamos nenhum pagamento.
        </Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryIcon}>
              <Ionicons name="document-text-outline" size={23} color={colors.coral} />
            </View>
            <View style={styles.summaryCopy}>
              <Text allowFontScaling style={styles.summaryLabel}>Tipo identificado</Text>
              <Text allowFontScaling style={styles.summaryValue}>{typeLabels[analysis.input.type]}</Text>
            </View>
          </View>

          {analysis.input.url ? (
            <View style={styles.detailRow}>
              <Text allowFontScaling style={styles.detailLabel}>Domínio</Text>
              <Text allowFontScaling style={styles.detailValue}>{analysis.input.url.domain}</Text>
              <Text allowFontScaling style={styles.detailMeta}>{analysis.input.url.scheme.toUpperCase()}</Text>
            </View>
          ) : null}

          {analysis.input.pix ? (
            <View style={styles.detailRow}>
              <Text allowFontScaling style={styles.detailLabel}>Chave Pix</Text>
              <Text allowFontScaling style={styles.detailValue}>{analysis.input.pix.maskedKey}</Text>
              <Text allowFontScaling style={styles.detailMeta}>{analysis.input.pix.keyType}</Text>
            </View>
          ) : null}

          {analysis.input.pix?.statedBeneficiary ? (
            <View style={styles.detailRow}>
              <Text allowFontScaling style={styles.detailLabel}>Beneficiário informado no QR Code</Text>
              <Text allowFontScaling style={styles.detailValue}>{analysis.input.pix.statedBeneficiary}</Text>
            </View>
          ) : null}

          {analysis.input.pix?.value !== null && analysis.input.pix?.value !== undefined ? (
            <View style={styles.detailRow}>
              <Text allowFontScaling style={styles.detailLabel}>Valor informado</Text>
              <Text allowFontScaling style={styles.detailValue}>{formatPixValue(analysis.input.pix.value)}</Text>
            </View>
          ) : null}

          {analysis.input.pix?.merchantCity ? (
            <View style={styles.detailRow}>
              <Text allowFontScaling style={styles.detailLabel}>Cidade informada</Text>
              <Text allowFontScaling style={styles.detailValue}>{analysis.input.pix.merchantCity}</Text>
            </View>
          ) : null}

          {analysis.input.phone ? (
            <View style={styles.detailRow}>
              <Text allowFontScaling style={styles.detailLabel}>Telefone</Text>
              <Text allowFontScaling style={styles.detailValue}>{analysis.input.phone}</Text>
            </View>
          ) : null}

          <View style={styles.temporaryNotice}>
            <Ionicons name="eye-off-outline" size={18} color={colors.emerald} />
            <Text allowFontScaling style={styles.temporaryText}>A mensagem original não é exibida nem armazenada.</Text>
          </View>
        </View>

        <AppButton label="Ver resultado da análise" icon="arrow-forward-outline" onPress={() => router.push('/result')} />
        <AppButton label="Voltar e editar" variant="quiet" onPress={() => router.back()} />
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
  description: {
    color: colors.textSecondary,
    fontSize: 17,
    lineHeight: 25,
  },
  summaryCard: {
    gap: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#322338',
  },
  summaryCopy: {
    gap: 2,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },
  summaryValue: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  detailRow: {
    gap: 4,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },
  detailValue: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  detailMeta: {
    color: colors.textSecondary,
    fontSize: 13,
    textTransform: 'uppercase',
  },
  temporaryNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: spacing.sm,
  },
  temporaryText: {
    flex: 1,
    color: colors.emerald,
    fontSize: 14,
    lineHeight: 20,
  },
});
