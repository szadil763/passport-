// Testes do motor de formulários do painel admin. Rode com: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { docToForm, formToDoc, getPath, setPath, slugify, validateId } from '../src/admin/forms.js';

const fields = [
  { key: 'title', label: 'Nome', type: 'text', required: true },
  { key: 'officialUrl', label: 'Site', type: 'url', required: true },
  { key: 'levels', label: 'Níveis', type: 'chips' },
  { key: 'steps', label: 'Passos', type: 'lines' },
  { key: 'closesAt', label: 'Fim', type: 'date' },
  { key: 'visa.name', label: 'Visto', type: 'text' },
  { key: 'costLevel', label: 'Custo', type: 'select', numeric: true },
  { key: 'extra', label: 'Extra', type: 'json' },
  { key: 'free', label: 'Gratuito', type: 'bool' },
  { key: 'country', label: 'País', type: 'select', nullable: true },
];

test('caminhos com ponto', () => {
  const o = {};
  setPath(o, 'visa.name', 'F-1');
  setPath(o, 'work.students', 'ok');
  assert.deepEqual(o, { visa: { name: 'F-1' }, work: { students: 'ok' } });
  assert.equal(getPath(o, 'visa.name'), 'F-1');
  assert.equal(getPath(o, 'visa.outro.x'), undefined);
});

test('slugify e validateId', () => {
  assert.equal(slugify('Nova Zelândia'), 'nova-zelandia');
  assert.equal(slugify('  Fulbright Brasil!  '), 'fulbright-brasil');
  assert.equal(validateId('', []) !== '', true);
  assert.equal(validateId('Com Espaço', []) !== '', true);
  assert.equal(validateId('chevening', ['chevening']) !== '', true);
  assert.equal(validateId('chevening', []), '');
});

test('docToForm e formToDoc fazem o caminho de ida e volta', () => {
  const doc = {
    title: 'Chevening',
    officialUrl: 'https://www.chevening.org',
    levels: ['pos-graduacao'],
    steps: ['um', 'dois'],
    closesAt: '2027-03-15',
    visa: { name: 'Student visa' },
    costLevel: 3,
    extra: [{ a: 1 }],
    free: true,
    country: null,
  };
  const form = docToForm(doc, fields);
  assert.equal(form.steps, 'um\ndois');
  assert.equal(form.costLevel, '3');
  const { data, errors } = formToDoc(form, fields);
  assert.deepEqual(errors, {});
  assert.deepEqual(data, doc);
});

test('formToDoc acusa campos obrigatórios, endereço, data e json inválidos', () => {
  const form = docToForm(null, fields);
  form.officialUrl = 'chevening.org';
  form.closesAt = '15/03/2027';
  form.extra = '[{';
  const { errors } = formToDoc(form, fields);
  assert.match(errors.title, /Preencha/);
  assert.match(errors.officialUrl, /https/);
  assert.match(errors.closesAt, /data válida/);
  assert.match(errors.extra, /JSON/);
});

test('campos vazios opcionais viram null ou lista vazia', () => {
  const form = docToForm(null, fields);
  form.title = ' X ';
  form.officialUrl = 'https://exemplo.org';
  const { data, errors } = formToDoc(form, fields);
  assert.deepEqual(errors, {});
  assert.equal(data.title, 'X');
  assert.equal(data.closesAt, null);
  assert.equal(data.country, null);
  assert.deepEqual(data.levels, []);
  assert.deepEqual(data.extra, []);
});
