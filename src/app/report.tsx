import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

const centralBankSecurityUrl = 'https://www.bcb.gov.br/estabilidadefinanceira/pix-seguranca';
const steps = [
  'Não faça o pagamento.',
  'Entre imediatamente em contato com seu banco.',
  'Se houve transferência, solicite contestação e o MED.',
  'Preserve mensagens, comprovantes, telefones, links e horários.',
  'Registre um boletim de ocorrência e procure o Banco Central, Procon ou outra autoridade competente quando necessário.',
];

export default function ReportScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerIcon}>
          <Ionicons name="megaphone-outline" size={30} color={colors.coral} />
        </View>
        <Text allowFontScaling style={styles.eyebrow}>ORIENTAÇÃO</Text>
        <Text allowFontScaling style={styles.title}>Se você suspeita de um golpe</Text>
        <Text allowFontScaling style={styles.description}>
          O app não registra a denúncia por você. Siga estes passos e procure ajuda pelos canais oficiais.
        </Text>

        <View style={styles.stepsCard}>
          {steps.map((step, index) => (
            <View key={step} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text allowFontScaling style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text allowFontScaling style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={styles.notice}>
          <Text allowFontScaling style={styles.noticeTitle}>O que é o MED?</Text>
          <Text allowFontScaling style={styles.noticeText}>
            O Mecanismo Especial de Devolução pode ajudar em casos de fraude, golpe ou crime. A análise do banco e a devolução não são garantidas.
          </Text>
        </View>

        <AppButton
          label="Abrir orientações do Banco Central"
          icon="open-outline"
          variant="secondary"
          onPress={() => void Linking.openURL(centralBankSecurityUrl)}
        />
        <AppButton label="Voltar para o resultado" variant="quiet" onPress={() => router.back()} />
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
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#322338',
    borderWidth: 1,
    borderColor: '#633A4B',
    marginTop: spacing.md,
  },
  eyebrow: {
    color: colors.coral,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
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
  stepsCard: {
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.coral,
  },
  stepNumberText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '900',
  },
  stepText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 23,
  },
  notice: {
    gap: 5,
    padding: spacing.md,
    borderRadius: 20,
    backgroundColor: '#2C2417',
    borderWidth: 1,
    borderColor: '#5B4724',
  },
  noticeTitle: {
    color: colors.amber,
    fontSize: 16,
    fontWeight: '900',
  },
  noticeText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
