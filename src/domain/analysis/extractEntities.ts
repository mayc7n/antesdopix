import type { InputOrigin, InputType, PixInfo, PixKeyType, UrlInfo } from './types';

const shortenerDomains = new Set([
  'bit.ly',
  't.co',
  'tinyurl.com',
  'is.gd',
  ' ow.ly'.trim(),
]);

const urlPattern = /((https?):\/\/|www\.)([^\s/]+)([^\s]*)/i;
const phonePattern = /^(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?\d{4,5}[\s-]?\d{4}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const randomKeyPattern = /^[a-f0-9-]{32,36}$/i;

function extractUrl(text: string): UrlInfo | undefined {
  const match = text.match(urlPattern);

  if (!match) {
    return undefined;
  }

  const scheme = match[2]?.toLowerCase() === 'http' ? 'http' : 'https';
  const domain = match[3]?.toLowerCase() ?? '';

  if (!domain) {
    return undefined;
  }

  return {
    domain,
    scheme,
    isShortener: shortenerDomains.has(domain),
  };
}

function maskKey(value: string): string {
  const compactValue = value.trim();

  if (compactValue.length <= 4) {
    return `***${compactValue}`;
  }

  return `***${compactValue.slice(-4)}`;
}

function getPixKeyType(value: string): PixKeyType {
  const digits = value.replace(/\D/g, '');

  if (digits.length === 11) {
    return 'cpf';
  }

  if (digits.length === 14) {
    return 'cnpj';
  }

  if (emailPattern.test(value)) {
    return 'email';
  }

  if (phonePattern.test(value)) {
    return 'telefone';
  }

  if (randomKeyPattern.test(value)) {
    return 'aleatoria';
  }

  return 'desconhecida';
}

function extractPixInfo(text: string): PixInfo | undefined {
  const pixMarker = text.match(/chave\s+pix\s*[:\-]?\s*([^\s,;]+)/i);

  if (!pixMarker?.[1]) {
    return undefined;
  }

  const candidate = pixMarker[1].replace(/[.)]+$/, '');

  return {
    keyType: getPixKeyType(candidate),
    maskedKey: maskKey(candidate),
    statedBeneficiary: null,
    value: null,
  };
}

function detectType(
  text: string,
  origin: InputOrigin,
  url: UrlInfo | undefined,
  pix: PixInfo | undefined,
): InputType {
  if (origin === 'qrCode') {
    return 'qrCode';
  }

  if (pix) {
    return 'chavePix';
  }

  if (url && urlPattern.test(text.trim())) {
    return 'link';
  }

  if (phonePattern.test(text.trim())) {
    return 'telefone';
  }

  return 'mensagem';
}

export interface ExtractedEntities {
  type: InputType;
  url?: UrlInfo;
  pix?: PixInfo;
  phone?: string;
}

export function extractEntities(text: string, origin: InputOrigin): ExtractedEntities {
  const url = extractUrl(text);
  const pix = extractPixInfo(text);
  const type = detectType(text, origin, url, pix);

  return {
    type,
    ...(url ? { url } : {}),
    ...(pix ? { pix } : {}),
    ...(type === 'telefone' ? { phone: text.trim() } : {}),
  };
}
