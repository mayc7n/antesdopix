interface PayloadField {
  id: string;
  value: string;
}

export interface ParsedPixPayload {
  key: string | null;
  merchantName: string | null;
  merchantCity: string | null;
  value: number | null;
}

function parseFields(payload: string): PayloadField[] | null {
  const fields: PayloadField[] = [];
  let position = 0;

  while (position < payload.length) {
    const id = payload.slice(position, position + 2);
    const lengthText = payload.slice(position + 2, position + 4);
    const length = Number.parseInt(lengthText, 10);

    if (!/^\d{2}$/.test(id) || !/^\d{2}$/.test(lengthText) || !Number.isInteger(length)) {
      return null;
    }

    const valueStart = position + 4;
    const valueEnd = valueStart + length;

    if (valueEnd > payload.length) {
      return null;
    }

    fields.push({ id, value: payload.slice(valueStart, valueEnd) });
    position = valueEnd;
  }

  return fields;
}

function getField(fields: PayloadField[], id: string): string | null {
  return fields.find((field) => field.id === id)?.value ?? null;
}

function getMerchantAccountInformation(fields: PayloadField[]): string | null {
  return fields.find((field) => {
    const id = Number.parseInt(field.id, 10);
    return id >= 26 && id <= 51;
  })?.value ?? null;
}

export function parsePixPayload(payload: string): ParsedPixPayload | null {
  const fields = parseFields(payload.trim());
  const merchantAccountInformation = fields
    ? getMerchantAccountInformation(fields)
    : null;

  if (!fields || !merchantAccountInformation) {
    return null;
  }

  const accountFields = parseFields(merchantAccountInformation);
  const gui = accountFields ? getField(accountFields, '00') : null;

  if (gui?.toLowerCase() !== 'br.gov.bcb.pix') {
    return null;
  }

  const rawValue = getField(fields, '54');
  const parsedValue = rawValue ? Number.parseFloat(rawValue) : null;

  return {
    key: accountFields ? getField(accountFields, '01') : null,
    merchantName: getField(fields, '59'),
    merchantCity: getField(fields, '60'),
    value: parsedValue !== null && Number.isFinite(parsedValue) ? parsedValue : null,
  };
}
