// Testes das funções puras. Rode com: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize, matchesQuery } from '../src/utils/text.js';
import { daysUntil, deadlineText, addDaysIso, isIsoDate, parseIsoDate } from '../src/utils/dates.js';
import { buildIcs } from '../src/utils/ics.js';
import { parseMoney, budgetTotals } from '../src/data/budget.js';

test('normalize tira acento e caixa', () => {
  assert.equal(normalize('  Educação  '), 'educacao');
  assert.equal(normalize('FRANÇA'), 'franca');
});

test('matchesQuery exige todas as palavras e ignora acento', () => {
  assert.equal(matchesQuery('franca inglês', 'França', ['inglês', 'francês']), true);
  assert.equal(matchesQuery('japao canada', 'Japão'), false);
  assert.equal(matchesQuery('', 'qualquer coisa'), true);
});

test('datas: validação e contagem de dias', () => {
  assert.equal(isIsoDate('2027-03-15'), true);
  assert.equal(isIsoDate('15/03/2027'), false);
  assert.equal(parseIsoDate('2027-02-30'), null);
  const hoje = new Date(2027, 2, 10, 15, 30);
  assert.equal(daysUntil('2027-03-15', hoje), 5);
  assert.equal(daysUntil('2027-03-10', hoje), 0);
  assert.equal(daysUntil('2027-03-09', hoje), -1);
  assert.equal(daysUntil('lixo', hoje), null);
});

test('textos de prazo', () => {
  assert.equal(deadlineText(-3), 'Encerrado');
  assert.equal(deadlineText(0), 'Fecha hoje');
  assert.equal(deadlineText(1), 'Fecha amanhã');
  assert.equal(deadlineText(12), 'Fecha em 12 dias');
  assert.equal(deadlineText(null), '');
});

test('addDaysIso passa de mês e de ano', () => {
  assert.equal(addDaysIso('2027-01-31', 1), '2027-02-01');
  assert.equal(addDaysIso('2026-12-31', 1), '2027-01-01');
  assert.equal(addDaysIso('2027-03-15', -7), '2027-03-08');
});

test('buildIcs gera um evento de dia inteiro válido', () => {
  const ics = buildIcs({
    title: 'Conferir edital, Chevening',
    description: 'Linha 1\nLinha 2; com ponto e vírgula',
    url: 'https://www.chevening.org',
    date: '2027-03-15',
    uid: 'teste',
    now: new Date('2027-01-01T10:00:00Z'),
  });
  assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
  assert.match(ics, /DTSTART;VALUE=DATE:20270315\r\n/);
  assert.match(ics, /DTEND;VALUE=DATE:20270316\r\n/);
  assert.match(ics, /SUMMARY:Conferir edital\\, Chevening\r\n/);
  assert.match(ics, /DESCRIPTION:Linha 1\\nLinha 2\; com ponto e vírgula\r\n/);
  assert.match(ics, /END:VCALENDAR\r\n$/);
  assert.throws(() => buildIcs({ title: 'x', date: 'lixo' }));
});

test('orçamento: valores em reais', () => {
  assert.equal(parseMoney('1.500,50'), 1500.5);
  assert.equal(parseMoney('R$ 2.000'), 2000);
  assert.equal(parseMoney('abc'), 0);
  const t = budgetTotals({ curso: '10000', passagem: '5000', moradia: '2000', alimentacao: '1000' }, '6');
  assert.deepEqual([t.once, t.monthly, t.total], [15000, 3000, 33000]);
});
