import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useAnalysisStore } from '@/state/analysisStore';

const privacyItems = [
  'A análise acontece somente neste aparelho.',
  'O texto original não é enviado para um servidor.',
  'Não criamos histórico das suas análises.',
  'O app não acessa banco, carteira, contatos, localização ou microfone.',
];

export default function PrivacyScreen() {
  const router = useRouter();
  const clearAnalysis = useAnalysisStore((state) => state.clearAnalysis);

  const handleClearAnalysis = () => {
    clearAnalysis();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerIcon}>
          <Ionicons name="lock-closed-outline" size={30} color={colors.emerald} />
        </View>
        <Text allowFontScaling style={styles.eyebrow}>PRIVACIDADE</Text>
        <Text allowFontScaling style={styles.title}>Sua privacidade em primeiro lugar</Text>
        <Text allowFontScaling style={styles.description}>
          O Antes do Pix foi feito para ajudar sem pedir mais informações do que precisa.
        </Text>

        <View style={styles.listCard}>
          {privacyItems.map((item) => (
            <View key={item} style={styles.itemRow}>
              <Ionicons name="checkmark-circle-outline" size={22} color={colors.emerald} />
              <Text allowFontScaling style={styles.itemText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.notice}>
          <Text allowFontScaling style={styles.noticeTitle}>Sobre esta análise</Text>
          <Text allowFontScaling style={styles.noticeText}>
            O texto usado na conferência fica disponível apenas enquanto você está neste fluxo. Ao apagar ou iniciar outra análise, ele deixa de ser usado.
          </Text>
        </View>

        <AppButton label="Apagar análise atual" icon="trash-outline" variant="secondary" onPress={handleClearAnalysis} />
        <AppButton label="Voltar para o início" variant="quiet" onPress={() => router.replace('/')} />
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
    backgroundColor: '#122A2A',
    borderWidth: 1,
    borderColor: '#20504A',
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
  listCard: {
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  itemText: {
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
