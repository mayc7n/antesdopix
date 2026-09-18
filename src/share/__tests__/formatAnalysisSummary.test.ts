import { analyzeInput } from '@/domain/analysis/analyzeInput';
import { formatAnalysisSummary } from '../formatAnalysisSummary';

describe('formatAnalysisSummary', () => {
  it('usa uma classificação legível no resumo compartilhado', () => {
    const analysis = analyzeInput('Pague agora para resgatar seu prêmio.', 'manual');

    expect(formatAnalysisSummary(analysis)).toContain('Classificação: Atenção');
    expect(formatAnalysisSummary(analysis)).not.toContain('Classificação: atencao');
  });
});
