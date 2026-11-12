/**
 * Envia o conteúdo de seed/*.json (countries, places, courses, calls, channels e resources) para o Firestore.
 *
 * Produção (projeto real no Firebase):
 *   1. Console Firebase > Configurações do projeto > Contas de serviço >
 *      "Gerar nova chave privada". Salve o arquivo como serviceAccount.json
 *      na raiz do projeto (ele já está no .gitignore: nunca commite).
 *   2. Rode:  npm run seed
 *      (o script acha o serviceAccount.json sozinho; se preferir outro caminho,
 *      defina a variável GOOGLE_APPLICATION_CREDENTIALS)
 *
 * Emulador local (com `npm run emulators` rodando em outro terminal):
 *        npm run seed:emulador
 *
 * O script é idempotente: rodar de novo sobrescreve os mesmos documentos.
 * Com --somente-novos (npm run seed -- --somente-novos), só grava o que ainda não existe:
 * use depois de editar conteúdo pelo painel admin, para não desfazer as edições.
 */
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// --emulador liga o modo emulador sem precisar de variável de ambiente (funciona no Windows).
if (process.argv.includes('--emulador') && !process.env.FIRESTORE_EMULATOR_HOST) {
  process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
}
const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST;

// Sem variável definida, procura o serviceAccount.json na raiz do projeto.
const defaultKey = fileURLToPath(new URL('../serviceAccount.json', import.meta.url));
if (!emulatorHost && !process.env.GOOGLE_APPLICATION_CREDENTIALS && existsSync(defaultKey)) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = defaultKey;
}

if (!emulatorHost && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error(
    'Faltam as credenciais.\n' +
      '• Para o Firebase de verdade: salve a chave da conta de serviço como serviceAccount.json\n' +
      '  na raiz do projeto e rode "npm run seed" (passo a passo no README).\n' +
      '• Para o emulador: rode "npm run emulators" em um terminal e "npm run seed:emulador" em outro.'
  );
  process.exit(1);
}

// No emulador não há credencial: basta um id de projeto (o mesmo usado pelo app).
const projectId = process.env.GCLOUD_PROJECT || 'demo-carimbo';
initializeApp(emulatorHost ? { projectId } : { credential: applicationDefault() });
const db = getFirestore();

async function load(file) {
  const text = await readFile(new URL(`../seed/${file}`, import.meta.url), 'utf8');
  return JSON.parse(text);
}

// --somente-novos: não mexe em documentos que já existem (preserva o que foi editado no painel admin).
const onlyNew = process.argv.includes('--somente-novos');

async function seed(collectionName, items) {
  const batch = db.batch();
  let written = 0;
  let skipped = 0;
  for (const { id, ...data } of items) {
    if (!id) throw new Error(`Item sem "id" em ${collectionName}: ${JSON.stringify(data).slice(0, 80)}`);
    const ref = db.collection(collectionName).doc(id);
    if (onlyNew && (await ref.get()).exists) {
      skipped += 1;
      continue;
    }
    batch.set(ref, { ...data, updatedAt: FieldValue.serverTimestamp() });
    written += 1;
  }
  if (written) await batch.commit();
  console.log(`✔ ${written} documentos gravados em "${collectionName}"${skipped ? ` (${skipped} já existiam e foram mantidos)` : ''}`);
}

try {
  console.log(emulatorHost ? `Usando o emulador em ${emulatorHost} (projeto ${projectId})` : 'Usando o Firebase de produção');
  await seed('countries', await load('countries.json'));
  await seed('places', await load('places.json'));
  await seed('courses', await load('courses.json'));
  await seed('calls', await load('calls.json'));
  await seed('channels', await load('channels.json'));
  await seed('resources', await load('resources.json'));
  console.log('Seed concluído.');
} catch (error) {
  console.error('O seed falhou:', error.message);
  process.exit(1);
}
