import type { AnalysisResult, RiskLevel } from '@/domain/analysis/types';

const riskLevelLabels: Record<RiskLevel, string> = {
  baixoRisco: 'Poucos sinais',
  atencao: 'Atenção',
  possivelGolpe: 'Possível golpe',
};

export function formatAnalysisSummary(analysis: AnalysisResult): string {
  return [
    'Antes do Pix — resumo da análise',
    `Classificação: ${riskLevelLabels[analysis.result.level]}`,
    '',
    ...analysis.result.signals.map((signal) => `• ${signal.title}`),
    '',
    'Este resultado não garante que o pagamento seja seguro. Confirme o beneficiário no aplicativo do seu banco.',
  ].join('\n');
}
