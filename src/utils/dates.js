// Datas de editais. As datas vêm como texto "AAAA-MM-DD" (sem horário).
const ISO = /^\d{4}-\d{2}-\d{2}$/;

export const isIsoDate = (value) => typeof value === 'string' && ISO.test(value);

// Converte "AAAA-MM-DD" em data local (meia-noite), sem erro de fuso.
export function parseIsoDate(value) {
  if (!isIsoDate(value)) return null;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d ? date : null;
}

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

// Dias entre hoje e a data (negativo se já passou). Devolve null se a data for inválida.
export function daysUntil(value, today = new Date()) {
  const target = parseIsoDate(value);
  if (!target) return null;
  return Math.round((target - startOfDay(today)) / 86400000);
}

export function formatDate(value) {
  const date = parseIsoDate(value);
  return date ? date.toLocaleDateString('pt-BR') : '';
}

// Texto do prazo: "Fecha hoje", "Fecha em 5 dias", "Encerrado".
export function deadlineText(days) {
  if (days === null) return '';
  if (days < 0) return 'Encerrado';
  if (days === 0) return 'Fecha hoje';
  if (days === 1) return 'Fecha amanhã';
  return `Fecha em ${days} dias`;
}

// Soma dias a uma data "AAAA-MM-DD" e devolve "AAAA-MM-DD".
export function addDaysIso(value, days) {
  const date = parseIsoDate(value);
  if (!date) return null;
  date.setDate(date.getDate() + days);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
