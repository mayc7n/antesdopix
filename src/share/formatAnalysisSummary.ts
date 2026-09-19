import type { AnalysisResult, InputType, RiskLevel } from '@/domain/analysis/types';

const riskLevelLabels: Record<RiskLevel, string> = {
  baixoRisco: 'Poucos sinais',
  atencao: 'Atenção',
  possivelGolpe: 'Possível golpe',
};

const inputTypeLabels: Record<InputType, string> = {
  mensagem: 'Mensagem',
  link: 'Link',
  telefone: 'Telefone',
  chavePix: 'Chave Pix',
  qrCode: 'QR Code',
};

const formatPixValue = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format(value)
    .replace(/\u00a0/g, ' ');

function formatInputDetails(analysis: AnalysisResult): string[] {
  const details = [`Tipo: ${inputTypeLabels[analysis.input.type]}`];

  if (analysis.input.url) {
    details.push(`Domínio: ${analysis.input.url.domain} (${analysis.input.url.scheme.toUpperCase()})`);
  }

  if (analysis.input.pix) {
    details.push(`Chave Pix: ${analysis.input.pix.maskedKey}`);

    if (analysis.input.pix.statedBeneficiary) {
      details.push(`Beneficiário informado: ${analysis.input.pix.statedBeneficiary}`);
    }

    if (analysis.input.pix.value !== null) {
      details.push(`Valor informado: ${formatPixValue(analysis.input.pix.value)}`);
    }

    if (analysis.input.pix.merchantCity) {
      details.push(`Cidade informada: ${analysis.input.pix.merchantCity}`);
    }
  }

  return details;
}

export function formatAnalysisSummary(analysis: AnalysisResult): string {
  return [
    'Antes do Pix — resumo da análise',
    `Classificação: ${riskLevelLabels[analysis.result.level]}`,
    '',
    ...formatInputDetails(analysis),
    '',
    ...analysis.result.signals.map((signal) => `• ${signal.title}`),
    '',
    'Este resultado não garante que o pagamento seja seguro. Confirme o beneficiário no aplicativo do seu banco.',
  ].join('\n');
}
