import { create } from 'zustand';

import type { AnalysisResult } from '@/domain/analysis/types';

interface AnalysisState {
  currentAnalysis: AnalysisResult | null;
  setAnalysis: (analysis: AnalysisResult) => void;
  clearAnalysis: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  currentAnalysis: null,
  setAnalysis: (currentAnalysis) => set({ currentAnalysis }),
  clearAnalysis: () => set({ currentAnalysis: null }),
}));
