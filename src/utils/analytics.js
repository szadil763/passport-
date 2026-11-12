// Contador de acessos, sem dados pessoais. Funções puras (a gravação no Firestore fica em track.js).
// Cada dia tem um documento stats/AAAA-MM-DD com: views (páginas vistas), visitors (navegadores
// distintos no dia) e um contador por seção (s_inicio, s_destinos...).

export const SECTIONS = [
  { field: 's_inicio', label: 'Início' },
  { field: 's_destinos', label: 'Destinos e comparador' },
  { field: 's_lugares', label: 'Lugares' },
  { field: 's_cursos', label: 'Cursos online' },
  { field: 's_editais', label: 'Editais e bolsas' },
  { field: 's_canais', label: 'Canais do YouTube' },
  { field: 's_recursos', label: 'Recursos' },
  { field: 's_sobre', label: 'Sobre e créditos' },
  { field: 's_conta', label: 'Conta (caminho, perfil, favoritos)' },
  { field: 's_outros', label: 'Outras telas' },
];

// Em que seção do app está uma rota.
export function sectionOf(pathname = '/') {
  const first = String(pathname).split('?')[0].split('/').filter(Boolean)[0] ?? '';
  switch (first) {
    case '':
      return 's_inicio';
    case 'destinos':
    case 'comparar':
      return 's_destinos';
    case 'lugares':
      return 's_lugares';
    case 'cursos':
      return 's_cursos';
    case 'editais':
      return 's_editais';
    case 'canais':
      return 's_canais';
    case 'recursos':
      return 's_recursos';
    case 'sobre':
      return 's_sobre';
    case 'caminho':
    case 'orcamento':
    case 'favoritos':
    case 'perfil':
    case 'entrar':
      return 's_conta';
    default:
      return 's_outros';
  }
}

// Dia no fuso do Brasil, "AAAA-MM-DD", para o dia não virar no meio da tarde (UTC).
export function dayKey(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(date);
}

const toUtc = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};

// Dias entre duas chaves "AAAA-MM-DD" (a - b).
export const daysBetween = (a, b) => Math.round((toUtc(a) - toUtc(b)) / 86400000);

const sum = (docs, field) => docs.reduce((acc, d) => acc + (Number(d[field]) || 0), 0);

// Resume os documentos diários: hoje, últimos 7 e 30 dias, tabela por dia e total por seção.
export function summarize(docs, today = dayKey()) {
  const valid = docs.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d.id));
  const within = (n) => valid.filter((d) => {
    const age = daysBetween(today, d.id);
    return age >= 0 && age < n;
  });
  const totals = (list) => ({ views: sum(list, 'views'), visitors: sum(list, 'visitors') });

  const last30 = within(30);
  return {
    today: totals(within(1)),
    last7: totals(within(7)),
    last30: totals(last30),
    days: [...last30].sort((a, b) => b.id.localeCompare(a.id)).map((d) => ({
      day: d.id,
      views: Number(d.views) || 0,
      visitors: Number(d.visitors) || 0,
    })),
    sections: SECTIONS.map((s) => ({ ...s, views: sum(last30, s.field) })).sort((a, b) => b.views - a.views),
  };
}
