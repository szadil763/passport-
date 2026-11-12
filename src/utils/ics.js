// Gera um lembrete de calendário (.ics) de dia inteiro, aceito por Google Agenda, Apple e Outlook.
import { addDaysIso } from './dates.js';

const escapeText = (text) =>
  String(text ?? '').replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

// Linhas do .ics têm no máximo 75 caracteres: as maiores continuam na linha seguinte, com um espaço.
function fold(line) {
  const parts = [];
  let rest = line;
  while (rest.length > 74) {
    parts.push(rest.slice(0, 74));
    rest = ` ${rest.slice(74)}`;
  }
  parts.push(rest);
  return parts.join('\r\n');
}

const compact = (iso) => iso.replace(/-/g, '');

export function buildIcs({ title, description, url, date, uid, now = new Date() }) {
  const end = addDaysIso(date, 1);
  if (!end) throw new Error('Data inválida para o lembrete.');
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Carimbo//Lembretes//PT-BR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid ?? `${compact(date)}-${stamp}`}@carimbo`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${compact(date)}`,
    `DTEND;VALUE=DATE:${compact(end)}`,
    `SUMMARY:${escapeText(title)}`,
    `DESCRIPTION:${escapeText(description)}`,
    ...(url ? [`URL:${url}`] : []),
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeText(title)}`,
    'TRIGGER:PT9H',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return `${lines.map(fold).join('\r\n')}\r\n`;
}

// Baixa o arquivo no navegador.
export function downloadIcs(filename, content) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
