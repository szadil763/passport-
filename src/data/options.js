// Opções fixas usadas no perfil, nos filtros e nos rótulos.
// Os "id" são gravados no Firestore: não mude um id existente sem migrar os dados.

export const GOALS = [
  { id: 'idioma', label: 'Aprender um idioma' },
  { id: 'graduacao', label: 'Graduação' },
  { id: 'pos-graduacao', label: 'Mestrado ou doutorado' },
  { id: 'intercambio', label: 'Intercâmbio curto' },
  { id: 'voluntariado', label: 'Voluntariado' },
  { id: 'trabalho', label: 'Trabalhar no exterior' },
];

// Os nomes precisam ser iguais aos usados em countries/{id}.languages.
export const LANGUAGES = [
  { id: 'inglês', label: 'Inglês' },
  { id: 'espanhol', label: 'Espanhol' },
  { id: 'francês', label: 'Francês' },
  { id: 'alemão', label: 'Alemão' },
  { id: 'italiano', label: 'Italiano' },
  { id: 'português', label: 'Português' },
  { id: 'japonês', label: 'Japonês' },
];

export const BUDGETS = [
  { id: 'ate-15k', label: 'Até R$ 15 mil' },
  { id: '15-50k', label: 'R$ 15 mil a R$ 50 mil' },
  { id: 'acima-50k', label: 'Acima de R$ 50 mil' },
  { id: 'so-bolsa', label: 'Só com bolsa' },
];

export const CATEGORIES = [
  { id: 'bolsas', label: 'Bolsas' },
  { id: 'idiomas', label: 'Idiomas' },
  { id: 'intercambio', label: 'Intercâmbio' },
  { id: 'voluntariado', label: 'Voluntariado' },
  { id: 'orientacao', label: 'Orientação oficial' },
  { id: 'testes', label: 'Testes de idioma' },
  { id: 'trabalho', label: 'Trabalho' },
];

export const COST_LABELS = { 1: 'Custo baixo', 2: 'Custo médio', 3: 'Custo alto' };

// Busca o rótulo de um id numa lista de opções.
export const labelOf = (options, id) => options.find((o) => o.id === id)?.label ?? id;

// Nível dos editais.
export const LEVELS = [
  { id: 'graduacao', label: 'Graduação' },
  { id: 'pos-graduacao', label: 'Pós-graduação' },
  { id: 'pesquisa', label: 'Pesquisa' },
  { id: 'idioma', label: 'Idioma' },
];

// Cursos online.
export const COURSE_KINDS = [
  { id: 'universidade', label: 'Cursos de universidades' },
  { id: 'idioma', label: 'Idiomas' },
  { id: 'diploma', label: 'Graduação e pós online' },
];
export const PRICE_TYPES = [
  { id: 'gratuito', label: 'Gratuito' },
  { id: 'misto', label: 'Parte gratuita' },
  { id: 'pago', label: 'Pago' },
];
export const CERTIFICATES = { pago: 'Certificado pago', gratuito: 'Certificado gratuito', varia: 'Certificado: confira no site', nenhum: 'Sem certificado' };
