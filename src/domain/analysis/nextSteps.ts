import type { RiskLevel } from './types';

export interface NextStep {
  title: string;
  description: string;
}

const nextStepsByRisk: Record<RiskLevel, readonly NextStep[]> = {
  possivelGolpe: [
    {
      title: 'Interrompa agora',
      description: 'Não faça o pagamento nem informe senhas, tokens ou códigos.',
    },
    {
      title: 'Confirme por outro canal',
      description: 'Procure a pessoa ou empresa por um contato oficial que você já conheça.',
    },
    {
      title: 'Se já transferiu',
      description: 'Fale imediatamente com seu banco e preserve comprovantes e mensagens.',
    },
  ],
  atencao: [
    {
      title: 'Faça uma pausa',
      description: 'Pare e confirme o motivo da cobrança antes de pagar.',
    },
    {
      title: 'Confira os dados',
      description: 'Compare beneficiário e valor no aplicativo do seu banco.',
    },
    {
      title: 'Proteja seus acessos',
      description: 'Nunca informe senha, token, código SMS ou biometria.',
    },
  ],
  baixoRisco: [
    {
      title: 'Confira o beneficiário',
      description: 'Confirme o beneficiário e o valor diretamente no aplicativo do seu banco.',
    },
    {
      title: 'Decida sem pressa',
      description: 'Se algo parecer diferente, interrompa e confirme por um canal conhecido.',
    },
  ],
};

export function getNextSteps(level: RiskLevel): readonly NextStep[] {
  return nextStepsByRisk[level];
}
