import { ShareIntentProvider, useShareIntentContext } from 'expo-share-intent';
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { prepareSharedAnalysis } from '@/share/prepareSharedAnalysis';
import { useAnalysisStore } from '@/state/analysisStore';
import { colors } from '@/theme/colors';

function AppNavigator() {
  const router = useRouter();
  const setAnalysis = useAnalysisStore((state) => state.setAnalysis);
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntentContext();

  useEffect(() => {
    if (!hasShareIntent || !shareIntent.text) {
      return;
    }

    const analysis = prepareSharedAnalysis(shareIntent.text);
    resetShareIntent();

    if (analysis) {
      setAnalysis(analysis);
      router.push('/review');
    }
  }, [hasShareIntent, resetShareIntent, router, setAnalysis, shareIntent.text]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'fade',
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <ShareIntentProvider>
      <AppNavigator />
    </ShareIntentProvider>
  );
}
