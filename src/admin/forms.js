// Lógica dos formulários do painel admin, sem React: converte documento <-> texto dos campos e valida.
// Tipos de campo: text, url, textarea, select, number, chips, lines, json, date, bool.
import { isIsoDate } from '../utils/dates.js';

// Lê e grava caminhos com ponto: "visa.name" -> doc.visa.name.
export function getPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

export function setPath(obj, path, value) {
  const keys = path.split('.');
  let node = obj;
  keys.slice(0, -1).forEach((key) => {
    if (typeof node[key] !== 'object' || node[key] === null) node[key] = {};
    node = node[key];
  });
  node[keys[keys.length - 1]] = value;
}

// Gera o id do documento a partir de um nome: "Nova Zelândia" -> "nova-zelandia".
export function slugify(text) {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const isUrl = (text) => /^https?:\/\/\S+\.\S+/.test(text);

// Documento -> valores dos campos (tudo vira texto, lista ou booleano).
export function docToForm(doc, fields) {
  const form = {};
  fields.forEach((f) => {
    const value = doc ? getPath(doc, f.key) : undefined;
    switch (f.type) {
      case 'chips':
        form[f.key] = Array.isArray(value) ? value : [];
        break;
      case 'lines':
        form[f.key] = Array.isArray(value) ? value.join('\n') : '';
        break;
      case 'json':
        form[f.key] = JSON.stringify(value ?? f.empty ?? [], null, 2);
        break;
      case 'bool':
        form[f.key] = Boolean(value);
        break;
      default:
        form[f.key] = value == null ? '' : String(value);
    }
  });
  return form;
}

// Valores dos campos -> documento. Devolve { data, errors }; errors tem uma mensagem por campo com problema.
export function formToDoc(form, fields) {
  const data = {};
  const errors = {};

  fields.forEach((f) => {
    const raw = form[f.key];
    let value;

    switch (f.type) {
      case 'chips':
        value = Array.isArray(raw) ? raw : [];
        if (f.required && !value.length) errors[f.key] = `Escolha pelo menos uma opção em "${f.label}".`;
        break;
      case 'lines':
        value = String(raw ?? '').split('\n').map((l) => l.trim()).filter(Boolean);
        if (f.required && !value.length) errors[f.key] = `Preencha "${f.label}".`;
        break;
      case 'json':
        try {
          value = String(raw ?? '').trim() ? JSON.parse(raw) : f.empty ?? [];
          if (!Array.isArray(value)) throw new Error('lista');
        } catch {
          errors[f.key] = `"${f.label}" não é uma lista JSON válida. Confira vírgulas, aspas e colchetes.`;
        }
        break;
      case 'bool':
        value = Boolean(raw);
        break;
      case 'number': {
        const text = String(raw ?? '').trim();
        value = text === '' ? null : Number(text);
        if (f.required && value === null) errors[f.key] = `Preencha "${f.label}".`;
        else if (value !== null && !Number.isFinite(value)) errors[f.key] = `"${f.label}" precisa ser um número.`;
        break;
      }
      case 'date': {
        const text = String(raw ?? '').trim();
        value = text === '' ? null : text;
        if (value !== null && !isIsoDate(value)) errors[f.key] = `"${f.label}" precisa ser uma data válida.`;
        break;
      }
      default: {
        const text = String(raw ?? '').trim();
        value = text === '' && f.nullable ? null : f.numeric && text !== '' ? Number(text) : text;
        if (f.required && text === '') errors[f.key] = `Preencha "${f.label}".`;
        else if (f.type === 'url' && text !== '' && !isUrl(text)) {
          errors[f.key] = `"${f.label}" precisa começar com https:// e ser um endereço completo.`;
        }
      }
    }

    if (!errors[f.key]) setPath(data, f.key, value);
  });

  return { data, errors };
}

// Confere o id de um documento novo.
export function validateId(id, existingIds = []) {
  if (!id) return 'Digite um identificador (use letras minúsculas, números e hífen).';
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) return 'O identificador só pode ter letras minúsculas, números e hífen.';
  if (existingIds.includes(id)) return 'Já existe um item com esse identificador.';
  return '';
}
