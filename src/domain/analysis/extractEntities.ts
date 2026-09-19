import type { InputOrigin, InputType, PixInfo, PixKeyType, UrlInfo } from './types';
import { parsePixPayload } from './parsePixPayload';

const shortenerDomains = new Set([
  'bit.ly',
  't.co',
  'tinyurl.com',
  'is.gd',
  ' ow.ly'.trim(),
]);

const urlPattern = /((https?):\/\/|www\.)([^\s/]+)([^\s]*)/i;
const phonePattern = /^(?:\+?55[\s.-]?)?(?:\(?\d{2}\)?[\s.-]?)?\d{4,5}[\s.-]?\d{4}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const randomKeyPattern = /^[a-f0-9-]{32,36}$/i;

function extractUrl(text: string): UrlInfo | undefined {
  const match = text.match(urlPattern);

  if (!match) {
    return undefined;
  }

  const scheme = match[2]?.toLowerCase() === 'http' ? 'http' : 'https';
  const domain = match[3]?.toLowerCase() ?? '';
  const comparableDomain = domain.replace(/^www\./, '');

  if (!domain) {
    return undefined;
  }

  return {
    domain,
    scheme,
    isShortener: shortenerDomains.has(comparableDomain),
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

  if (isValidCpf(digits)) {
    return 'cpf';
  }

  if (isValidCnpj(digits)) {
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

function isRepeatedDigits(value: string): boolean {
  return /^([0-9])\1+$/.test(value);
}

function calculateDigit(value: string, weights: number[]): number {
  const sum = value
    .split('')
    .reduce((total, digit, index) => total + Number(digit) * (weights[index] ?? 0), 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

function isValidCpf(value: string): boolean {
  if (value.length !== 11 || isRepeatedDigits(value)) {
    return false;
  }

  const firstDigit = calculateDigit(value.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const secondDigit = calculateDigit(value.slice(0, 9) + firstDigit, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);

  return value === value.slice(0, 9) + firstDigit + secondDigit;
}

function isValidCnpj(value: string): boolean {
  if (value.length !== 14 || isRepeatedDigits(value)) {
    return false;
  }

  const firstDigit = calculateDigit(value.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const secondDigit = calculateDigit(value.slice(0, 12) + firstDigit, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return value === value.slice(0, 12) + firstDigit + secondDigit;
}

function isRawPixKey(text: string): boolean {
  const trimmedText = text.trim();
  const keyType = getPixKeyType(trimmedText);

  return (
    emailPattern.test(trimmedText) ||
    randomKeyPattern.test(trimmedText) ||
    keyType === 'cpf' ||
    keyType === 'cnpj'
  );
}

function createPixInfo(
  candidate: string,
  merchantName: string | null = null,
  value: number | null = null,
  merchantCity: string | null = null,
): PixInfo {
  return {
    keyType: getPixKeyType(candidate),
    maskedKey: maskKey(candidate),
    statedBeneficiary: merchantName,
    value,
    merchantCity,
  };
}

function extractPixInfo(text: string, origin: InputOrigin): PixInfo | undefined {
  if (origin === 'qrCode') {
    const parsedPayload = parsePixPayload(text);

    if (parsedPayload?.key) {
      return createPixInfo(
        parsedPayload.key,
        parsedPayload.merchantName,
        parsedPayload.value,
        parsedPayload.merchantCity,
      );
    }
  }

  const pixMarker = text.match(/chave\s+pix\s*[:\-]?\s*([^\s,;]+)/i);
  const candidate = pixMarker?.[1] ?? (isRawPixKey(text) ? text.trim() : null);

  if (!candidate) {
    return undefined;
  }

  return createPixInfo(candidate.replace(/[.!?)}\]]+$/, ''));
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
  const pix = extractPixInfo(text, origin);
  const type = detectType(text, origin, url, pix);

  return {
    type,
    ...(url ? { url } : {}),
    ...(pix ? { pix } : {}),
    ...(type === 'telefone' ? { phone: text.trim() } : {}),
  };
}
