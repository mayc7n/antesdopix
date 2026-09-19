export type InputOrigin = 'colar' | 'compartilhar' | 'manual' | 'qrCode';

export type InputType =
  | 'mensagem'
  | 'link'
  | 'telefone'
  | 'chavePix'
  | 'qrCode';

export type PixKeyType =
  | 'cpf'
  | 'cnpj'
  | 'telefone'
  | 'email'
  | 'aleatoria'
  | 'desconhecida';

export type RiskLevel = 'baixoRisco' | 'atencao' | 'possivelGolpe';

export type SignalSeverity = 'baixa' | 'media' | 'alta';

export type SignalCode =
  | 'urgencia'
  | 'premio'
  | 'pedidoDeSegredo'
  | 'dominioEstranho'
  | 'linkInseguro'
  | 'chaveInvalida'
  | 'pressaoEmocional';

export interface UrlInfo {
  domain: string;
  scheme: 'http' | 'https';
  isShortener: boolean;
}

export interface PixInfo {
  keyType: PixKeyType;
  maskedKey: string;
  statedBeneficiary: string | null;
  value: number | null;
  merchantCity: string | null;
}

export interface AnalysisInput {
  origin: InputOrigin;
  textTemporario: true;
  type: InputType;
  url?: UrlInfo;
  pix?: PixInfo;
  phone?: string;
}

export interface RiskSignal {
  code: SignalCode;
  severity: SignalSeverity;
  title: string;
  explanation: string;
}

export interface AnalysisResult {
  input: AnalysisInput;
  result: {
    level: RiskLevel;
    signals: RiskSignal[];
    message: string;
    limitations: string[];
  };
}
