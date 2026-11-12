// Itens do orçamento. Os "id" são gravados em users/{uid}.budgetPlan: não mude um id existente.
// O app não sugere valores: cada pessoa digita a estimativa que pesquisou.

export const BUDGET_ONCE = [
  { id: 'curso', label: 'Curso ou mensalidade (total)', hint: 'Veja o valor no site da escola ou universidade.' },
  { id: 'passagem', label: 'Passagem de ida e volta', hint: 'Pesquise datas diferentes para comparar.' },
  { id: 'visto', label: 'Visto, taxas e documentos', hint: 'Some taxas de visto, tradução e exames.' },
  { id: 'seguro', label: 'Seguro-saúde ou seguro-viagem', hint: 'Alguns países exigem seguro para o visto.' },
  { id: 'reserva', label: 'Reserva para imprevistos', hint: 'Um colchão para emergências.' },
];

export const BUDGET_MONTHLY = [
  { id: 'moradia', label: 'Moradia', hint: 'Aluguel, contas e internet.' },
  { id: 'alimentacao', label: 'Alimentação', hint: 'Mercado e refeições fora.' },
  { id: 'transporte', label: 'Transporte', hint: 'Passe mensal ou outras viagens.' },
  { id: 'outros', label: 'Lazer e outros', hint: 'Telefone, saídas, roupas.' },
];

// Aceita "1500", "1.500", "1.500,50" ou "1500.5". Texto vazio ou inválido vira 0.
export function parseMoney(text) {
  if (typeof text === 'number') return Number.isFinite(text) && text > 0 ? text : 0;
  let t = String(text ?? '').replace(/[^\d.,]/g, '');
  if (!t) return 0;
  if (t.includes(',')) t = t.replace(/\./g, '').replace(',', '.');
  else if (/^\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, '');
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

const sum = (items, values) => items.reduce((acc, i) => acc + parseMoney(values[i.id]), 0);

export function budgetTotals(values = {}, months = 0) {
  const once = sum(BUDGET_ONCE, values);
  const monthly = sum(BUDGET_MONTHLY, values);
  const m = Math.max(0, Math.floor(parseMoney(months)));
  return { once, monthly, months: m, total: once + monthly * m };
}

// Teto de cada faixa do perfil (null = sem teto ou não se aplica).
export const BUDGET_LIMITS = { 'ate-15k': 15000, '15-50k': 50000, 'acima-50k': null, 'so-bolsa': null };

export const formatBRL = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
