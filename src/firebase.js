// Inicialização do Firebase (SDK modular v10).
// As chaves vêm do arquivo .env (veja .env.example e o README).
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const env = import.meta.env;
const usingEmulators = env.VITE_USE_EMULATORS === 'true';

const config = {
  // Nos emuladores qualquer chave serve; em produção ela vem do .env.
  apiKey: env.VITE_FIREBASE_API_KEY || (usingEmulators ? 'demo-key' : undefined),
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'demo-carimbo',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

// Sem chave e sem emuladores o Firebase não funciona: o App mostra um aviso.
export const firebaseConfigured = Boolean(config.apiKey);

export const app = firebaseConfigured ? initializeApp(config) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

if (app && usingEmulators) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
}
