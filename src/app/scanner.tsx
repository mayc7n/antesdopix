import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { analyzeInput } from '@/domain/analysis/analyzeInput';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useAnalysisStore } from '@/state/analysisStore';

export default function ScannerScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isTorchEnabled, setIsTorchEnabled] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const setAnalysis = useAnalysisStore((state) => state.setAnalysis);

  const handleBarcodeScanned = ({ data }: BarcodeScanningResult) => {
    if (hasScanned || !data.trim()) {
      return;
    }

    const analysis = analyzeInput(data, 'qrCode');

    if (!analysis.input.pix && !analysis.input.url) {
      setScanError('Este QR Code não parece ser um Pix ou link conferível.');
      return;
    }

    setScanError(null);
    setHasScanned(true);
    setAnalysis(analysis);
  };

  const handleClose = () => router.replace('/');

  if (!permission) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text allowFontScaling style={styles.title}>Preparando o scanner</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.permissionContent}>
          <View style={styles.iconCircle}><Text style={styles.icon}>⌁</Text></View>
          <Text allowFontScaling style={styles.eyebrow}>QR CODE</Text>
          <Text allowFontScaling style={styles.title}>Escaneie o QR Code</Text>
          <Text allowFontScaling style={styles.description}>
            A câmera só será usada nesta etapa e não inicia pagamentos.
          </Text>
          <AppButton label="Permitir câmera" icon="camera-outline" onPress={() => void requestPermission()} />
          <AppButton label="Voltar para o início" variant="quiet" onPress={() => router.replace('/')} />
          {!permission.canAskAgain ? (
            <AppButton label="Abrir ajustes do aparelho" variant="quiet" onPress={() => void Linking.openSettings()} />
          ) : null}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.cameraSafeArea}>
      <CameraView
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        enableTorch={isTorchEnabled}
        onBarcodeScanned={hasScanned ? undefined : handleBarcodeScanned}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.cameraOverlay}>
        <View style={styles.cameraTopBar}>
          <AppButton
            label="Fechar scanner"
            icon="close-outline"
            variant="secondary"
            onPress={handleClose}
          />
        </View>
        <Text allowFontScaling style={styles.cameraTitle}>
          {hasScanned ? 'QR Code encontrado' : 'Aponte para o QR Code'}
        </Text>
        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
        {hasScanned ? (
          <View style={styles.foundCard} accessible accessibilityRole="text">
            <Ionicons name="checkmark-circle-outline" size={22} color={colors.emerald} />
            <Text allowFontScaling style={styles.foundText}>
              Confira os dados encontrados antes de continuar.
            </Text>
          </View>
        ) : (
          <Text allowFontScaling style={styles.cameraHint}>Mantenha o código inteiro dentro da moldura.</Text>
        )}
        {scanError ? (
          <Text accessibilityRole="alert" allowFontScaling style={styles.scanError}>
            {scanError}
          </Text>
        ) : null}
        {hasScanned ? (
          <AppButton
            label="Conferir QR Code"
            icon="arrow-forward-outline"
            onPress={() => router.push('/review')}
          />
        ) : (
          <AppButton
            label={isTorchEnabled ? 'Desligar lanterna' : 'Ligar lanterna'}
            icon="flashlight-outline"
            variant="secondary"
            onPress={() => setIsTorchEnabled((enabled) => !enabled)}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  cameraSafeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  permissionContent: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#322338',
    borderWidth: 1,
    borderColor: '#633A4B',
  },
  icon: {
    color: colors.coral,
    fontSize: 44,
    fontWeight: '900',
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
  cameraOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    backgroundColor: '#00000055',
  },
  cameraTopBar: {
    width: '100%',
    alignItems: 'flex-start',
  },
  cameraTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '900',
  },
  scanFrame: {
    width: 260,
    height: 260,
    position: 'relative',
  },
  corner: {
    width: 42,
    height: 42,
    position: 'absolute',
    borderColor: colors.coral,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 18,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 18,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 18,
  },
  bottomRight: {
    right: 0,
    bottom: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 18,
  },
  cameraHint: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
  },
  scanError: {
    color: colors.coral,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
    textAlign: 'center',
  },
  foundCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    width: '100%',
    padding: spacing.md,
    borderRadius: 18,
    backgroundColor: '#122A2A',
    borderWidth: 1,
    borderColor: '#20504A',
  },
  foundText: {
    flex: 1,
    color: colors.white,
    fontSize: 15,
    lineHeight: 21,
  },
});
