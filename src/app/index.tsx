import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

const futureMessage = (feature: string) =>
  Alert.alert('Estamos preparando esta etapa', `${feature} estará disponível em uma próxima atualização.`);

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.brandMark}>
            <Ionicons name="pause" size={14} color={colors.background} />
          </View>
          <Text allowFontScaling style={styles.brandName}>Antes do Pix</Text>
          <View style={styles.localPill}>
            <View style={styles.localDot} />
            <Text allowFontScaling style={styles.localLabel}>LOCAL</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="shield-checkmark-outline" size={50} color={colors.coral} />
            <View style={styles.pauseBadge}>
              <Ionicons name="pause" size={14} color={colors.background} />
            </View>
          </View>
          <Text allowFontScaling style={styles.eyebrow}>UM MOMENTO ANTES DE PAGAR</Text>
          <Text allowFontScaling style={styles.title}>Pare. Confira. Só depois decida.</Text>
          <Text allowFontScaling style={styles.description}>
            Recebeu algo suspeito? Cole, compartilhe ou escaneie antes de pagar.
          </Text>
        </View>

        <View style={styles.actionCard}>
          <Text allowFontScaling style={styles.actionTitle}>Como você recebeu isso?</Text>
          <AppButton label="Colar mensagem" icon="clipboard-outline" onPress={() => router.push('/manual')} />
          <AppButton
            label="Compartilhar mensagem"
            icon="share-social-outline"
            variant="secondary"
            onPress={() => futureMessage('O compartilhamento nativo já está disponível; selecione o Antes do Pix no menu de outro app.')}
          />
          <AppButton
            label="Inserir link, telefone ou chave Pix"
            icon="create-outline"
            variant="secondary"
            onPress={() => router.push('/manual')}
          />
          <AppButton
            label="Escanear QR Code"
            icon="scan-outline"
            variant="secondary"
            onPress={() => router.push('/scanner')}
          />
        </View>

        <View style={styles.privacyCard}>
          <Ionicons name="lock-closed-outline" size={20} color={colors.emerald} />
          <View style={styles.privacyCopy}>
            <Text allowFontScaling style={styles.privacyTitle}>Sua mensagem fica com você</Text>
            <Text allowFontScaling style={styles.privacyText}>
              A análise acontece no aparelho e não acessa banco, senha ou carteira digital.
            </Text>
          </View>
        </View>
        <AppButton
          label="Ler sobre privacidade"
          variant="quiet"
          icon="lock-closed-outline"
          onPress={() => router.push('/privacy')}
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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  topBar: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandMark: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  localPill: {
    marginLeft: 'auto',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#15392F',
  },
  localDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.emerald,
  },
  localLabel: {
    color: colors.emerald,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  hero: {
    alignItems: 'center',
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  heroIcon: {
    width: 112,
    height: 112,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#211F35',
    borderWidth: 1,
    borderColor: '#373655',
    marginBottom: spacing.sm,
  },
  pauseBadge: {
    position: 'absolute',
    right: -4,
    bottom: 6,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.amber,
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
    textAlign: 'center',
  },
  description: {
    maxWidth: 360,
    color: colors.textSecondary,
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
  },
  actionCard: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 26,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 2,
  },
  privacyCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 20,
    backgroundColor: '#122A2A',
    borderWidth: 1,
    borderColor: '#20504A',
  },
  privacyCopy: {
    flex: 1,
    gap: 4,
  },
  privacyTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
  },
  privacyText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
