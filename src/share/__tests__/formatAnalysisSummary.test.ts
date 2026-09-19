import { analyzeInput } from '@/domain/analysis/analyzeInput';
import { formatAnalysisSummary } from '../formatAnalysisSummary';

describe('formatAnalysisSummary', () => {
  it('usa uma classificação legível no resumo compartilhado', () => {
    const analysis = analyzeInput('Pague agora para resgatar seu prêmio.', 'manual');

    expect(formatAnalysisSummary(analysis)).toContain('Classificação: Atenção');
    expect(formatAnalysisSummary(analysis)).not.toContain('Classificação: atencao');
  });

  it('inclui dados identificados sem expor a mensagem original', () => {
    const analysis = analyzeInput(
      '00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913FULANO DE TAL6008BRASILIA62070503***6304ABCD',
      'qrCode',
    );

    const summary = formatAnalysisSummary(analysis);

    expect(summary).toContain('Tipo: QR Code');
    expect(summary).toContain('Chave Pix: ***4000');
    expect(summary).toContain('Beneficiário informado: FULANO DE TAL');
    expect(summary).toContain('Valor informado: R$ 10,00');
    expect(summary).toContain('Cidade informada: BRASILIA');
    expect(summary).not.toContain('00020126580014');
  });
});
