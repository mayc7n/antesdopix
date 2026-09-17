import { extractEntities } from './extractEntities';
import { normalizeText } from './normalizeText';
import { findRiskSignals } from './riskRules';
import type { AnalysisResult, InputOrigin, RiskLevel } from './types';

const limitations = [
  'O aplicativo não acessa sua conta bancária.',
  'A análise não garante que o pagamento seja seguro.',
  'Confirme o beneficiário diretamente no aplicativo do seu banco.',
];

const levelMessages: Record<RiskLevel, string> = {
  baixoRisco:
    'Encontramos poucos sinais de risco, mas isso não garante que o pagamento seja seguro. Confirme o beneficiário no aplicativo do seu banco.',
  atencao:
    'Pare um momento e confirme a origem, o beneficiário e o motivo da cobrança antes de pagar.',
  possivelGolpe:
    'Há sinais compatíveis com golpe. Não pague, não informe senhas e confirme diretamente com a pessoa ou empresa por um canal oficial.',
};

function classifyRisk(signalCount: number, hasHighSeverity: boolean): RiskLevel {
  if (hasHighSeverity || signalCount >= 3) {
    return 'possivelGolpe';
  }

  if (signalCount > 0) {
    return 'atencao';
  }

  return 'baixoRisco';
}

export function analyzeInput(text: string, origin: InputOrigin): AnalysisResult {
  const normalizedText = normalizeText(text);
  const extractedEntities = extractEntities(text, origin);
  const signals = findRiskSignals(normalizedText, extractedEntities);
  const level = classifyRisk(
    signals.length,
    signals.some((signal) => signal.severity === 'alta'),
  );

  return {
    input: {
      origin,
      textTemporario: true,
      ...extractedEntities,
    },
    result: {
      level,
      signals,
      message: levelMessages[level],
      limitations,
    },
  };
}
