import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { analyzeInput } from '@/domain/analysis/analyzeInput';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useAnalysisStore } from '@/state/analysisStore';

export default function ManualScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const clearAnalysis = useAnalysisStore((state) => state.clearAnalysis);
  const setAnalysis = useAnalysisStore((state) => state.setAnalysis);

  useEffect(() => {
    clearAnalysis();
  }, [clearAnalysis]);

  const handleAnalyze = () => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      setError('Cole ou digite algo para conferir.');
      return;
    }

    setError(null);
    setAnalysis(analyzeInput(trimmedText, 'manual'));
    router.push('/review');
  };

  const handleClearInput = () => {
    setText('');
    setError(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text allowFontScaling style={styles.eyebrow}>NOVA CONFERÊNCIA</Text>
        <Text allowFontScaling style={styles.title}>Cole o que você recebeu</Text>
        <Text allowFontScaling style={styles.description}>
          Pode ser uma mensagem inteira, um link, telefone ou chave Pix. Nós identificamos o tipo automaticamente.
        </Text>

        <View style={styles.inputCard}>
          <TextInput
            accessibilityLabel="Mensagem, link, telefone ou chave Pix"
            autoCapitalize="sentences"
            autoCorrect
            multiline
            maxLength={5000}
            onChangeText={setText}
            placeholder="Cole aqui a mensagem, link ou chave Pix"
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.coral}
            style={styles.input}
            textAlignVertical="top"
            value={text}
          />
          <View style={styles.inputFooter}>
            <Text allowFontScaling style={styles.helper}>Não guardamos o texto original.</Text>
            <Text allowFontScaling style={styles.counter}>{text.length}/5000</Text>
          </View>
        </View>

        {text.length > 0 ? (
          <AppButton
            label="Limpar campo"
            icon="close-circle-outline"
            variant="quiet"
            onPress={handleClearInput}
          />
        ) : null}

        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}

        <AppButton label="Analisar agora" icon="search-outline" onPress={handleAnalyze} />
        <AppButton label="Voltar para o início" variant="quiet" onPress={() => router.replace('/')} />

        <View style={styles.note}>
          <Text allowFontScaling style={styles.noteTitle}>Antes de continuar</Text>
          <Text allowFontScaling style={styles.noteText}>
            Nunca cole sua senha bancária. Se houver um código ou token na mensagem, o app vai sinalizar sem armazená-lo.
          </Text>
        </View>
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
  inputCard: {
    minHeight: 230,
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    minHeight: 170,
    color: colors.textPrimary,
    fontSize: 18,
    lineHeight: 26,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  helper: {
    flex: 1,
    color: colors.emerald,
    fontSize: 13,
    lineHeight: 18,
  },
  counter: {
    color: colors.textMuted,
    fontSize: 13,
  },
  error: {
    color: colors.coral,
    fontSize: 15,
    fontWeight: '700',
  },
  note: {
    gap: 4,
    padding: spacing.md,
    borderRadius: 18,
    backgroundColor: '#2C2417',
    borderWidth: 1,
    borderColor: '#5B4724',
  },
  noteTitle: {
    color: colors.amber,
    fontSize: 15,
    fontWeight: '800',
  },
  noteText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
