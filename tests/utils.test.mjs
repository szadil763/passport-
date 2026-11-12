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

// ---- Contador de acessos ----
import { SECTIONS, daysBetween, dayKey, sectionOf, summarize } from '../src/utils/analytics.js';

test('sectionOf agrupa as rotas por seção', () => {
  assert.equal(sectionOf('/'), 's_inicio');
  assert.equal(sectionOf('/destinos/canada'), 's_destinos');
  assert.equal(sectionOf('/comparar?p=a,b'), 's_destinos');
  assert.equal(sectionOf('/lugares/toronto'), 's_lugares');
  assert.equal(sectionOf('/perfil'), 's_conta');
  assert.equal(sectionOf('/qualquer-coisa'), 's_outros');
  assert.ok(SECTIONS.every((s) => s.field.startsWith('s_')));
});

test('dayKey usa o fuso de São Paulo', () => {
  // 02:00 UTC ainda é o dia anterior em São Paulo (UTC-3)
  assert.equal(dayKey(new Date('2027-03-15T02:00:00Z')), '2027-03-14');
  assert.equal(dayKey(new Date('2027-03-15T15:00:00Z')), '2027-03-15');
});

test('daysBetween e summarize', () => {
  assert.equal(daysBetween('2027-03-15', '2027-03-10'), 5);
  assert.equal(daysBetween('2027-03-01', '2027-02-28'), 1);
  const docs = [
    { id: '2027-03-15', views: 10, visitors: 4, s_inicio: 6, s_cursos: 4 },
    { id: '2027-03-14', views: 5, visitors: 2, s_inicio: 5 },
    { id: '2027-03-01', views: 20, visitors: 8, s_editais: 20 },
    { id: '2027-01-01', views: 99, visitors: 50 },
    { id: 'lixo', views: 1000 },
  ];
  const r = summarize(docs, '2027-03-15');
  assert.deepEqual(r.today, { views: 10, visitors: 4 });
  assert.deepEqual(r.last7, { views: 15, visitors: 6 });
  assert.deepEqual(r.last30, { views: 35, visitors: 14 });
  assert.equal(r.days.length, 3);
  assert.equal(r.days[0].day, '2027-03-15');
  assert.equal(r.sections[0].field, 's_editais');
  assert.equal(r.sections[0].views, 20);
});
