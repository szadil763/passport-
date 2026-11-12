// Texto sem acento e em minúsculas, para buscas que ignoram acento e caixa.
export const normalize = (text) =>
  String(text ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

// Verdadeiro se todas as palavras da busca aparecem em algum dos campos.
export function matchesQuery(query, ...fields) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const haystack = normalize(fields.flat().filter(Boolean).join(' '));
  return words.every((w) => haystack.includes(w));
}
