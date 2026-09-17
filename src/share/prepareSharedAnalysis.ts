import { analyzeInput } from '@/domain/analysis/analyzeInput';
import type { AnalysisResult } from '@/domain/analysis/types';

export function prepareSharedAnalysis(text: string): AnalysisResult | null {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return null;
  }

  return analyzeInput(trimmedText, 'compartilhar');
}
