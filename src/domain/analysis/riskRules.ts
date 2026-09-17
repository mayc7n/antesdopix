import type { ExtractedEntities } from './extractEntities';
import type { RiskSignal } from './types';

interface SignalRule {
  code: RiskSignal['code'];
  severity: RiskSignal['severity'];
  terms: string[];
  title: string;
  explanation: string;
}

const signalRules: SignalRule[] = [
  {
    code: 'urgencia',
    severity: 'media',
    terms: ['pague agora', 'ultima chance', 'conta sera bloqueada', 'transfira agora'],
    title: 'A mensagem cria pressão para pagar imediatamente',
    explanation: 'Golpistas costumam tentar impedir que você confira os dados.',
  },
  {
    code: 'premio',
    severity: 'media',
    terms: [
      'voce ganhou',
      'resgate seu premio',
      'resgatar seu premio',
      'credito liberado',
      'premio liberado',
    ],
    title: 'A mensagem promete um prêmio ou benefício inesperado',
    explanation: 'Promessas de dinheiro ou vantagens podem ser usadas para apressar uma decisão.',
  },
  {
    code: 'pedidoDeSegredo',
    severity: 'alta',
    terms: ['senha', 'token', 'codigo sms', 'codigo de verificacao', 'biometria'],
    title: 'A mensagem pede uma senha, código ou dado secreto',
    explanation: 'Nenhuma pessoa ou empresa confiável deve pedir seus códigos ou senhas por mensagem.',
  },
  {
    code: 'pressaoEmocional',
    severity: 'media',
    terms: ['nao conte para ninguem', 'nao conte', 'esta em perigo', 'seu filho', 'policia', 'ameaça'],
    title: 'A mensagem tenta provocar medo ou esconder a operação',
    explanation: 'Falsas urgências e pedidos de segredo dificultam que você peça ajuda e confira a história.',
  },
];

export function findRiskSignals(text: string, entities: ExtractedEntities): RiskSignal[] {
  const signals = signalRules
    .filter((rule) => rule.terms.some((term) => text.includes(term)))
    .map(({ code, severity, title, explanation }) => ({
      code,
      severity,
      title,
      explanation,
    }));

  if (entities.url?.scheme === 'http') {
    signals.push({
      code: 'linkInseguro',
      severity: 'media',
      title: 'O link não usa uma conexão protegida',
      explanation: 'Endereços começando com HTTP merecem cuidado extra antes de abrir ou informar dados.',
    });
  }

  if (entities.url?.isShortener) {
    signals.push({
      code: 'dominioEstranho',
      severity: 'media',
      title: 'O endereço esconde o domínio de destino',
      explanation: 'Links encurtados impedem que você veja para onde será levado antes de abrir.',
    });
  }

  if (entities.pix?.keyType === 'desconhecida') {
    signals.push({
      code: 'chaveInvalida',
      severity: 'media',
      title: 'A chave Pix não parece ter um formato conhecido',
      explanation: 'Confira a chave diretamente no aplicativo do banco antes de pagar.',
    });
  }

  return signals;
}
