/**
 * Envia o conteúdo de seed/countries.json e seed/resources.json para o Firestore.
 *
 * Produção (projeto real no Firebase):
 *   1. Console Firebase > Configurações do projeto > Contas de serviço >
 *      "Gerar nova chave privada". Salve o arquivo como serviceAccount.json
 *      na raiz do projeto (ele já está no .gitignore: nunca commite).
 *   2. Rode:
 *        GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json npm run seed
 *
 * Emulador local (com `npm run emulators` rodando em outro terminal):
 *        npm run seed:emulador
 *
 * O script é idempotente: rodar de novo sobrescreve os mesmos documentos.
 */
import { readFile } from 'node:fs/promises';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST;

if (!emulatorHost && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error(
    'Faltam as credenciais.\n' +
      '• Para o Firebase de verdade: GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json npm run seed\n' +
      '• Para o emulador: FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npm run seed'
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

async function seed(collectionName, items) {
  const batch = db.batch();
  for (const { id, ...data } of items) {
    if (!id) throw new Error(`Item sem "id" em ${collectionName}: ${JSON.stringify(data).slice(0, 80)}`);
    batch.set(db.collection(collectionName).doc(id), { ...data, updatedAt: FieldValue.serverTimestamp() });
  }
  await batch.commit();
  console.log(`✔ ${items.length} documentos gravados em "${collectionName}"`);
}

try {
  console.log(emulatorHost ? `Usando o emulador em ${emulatorHost} (projeto ${projectId})` : 'Usando o Firebase de produção');
  await seed('countries', await load('countries.json'));
  await seed('resources', await load('resources.json'));
  console.log('Seed concluído.');
} catch (error) {
  console.error('O seed falhou:', error.message);
  process.exit(1);
}
