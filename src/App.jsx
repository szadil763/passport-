import { firebaseConfigured } from './firebase';

export default function App() {
  if (!firebaseConfigured) {
    return (
      <main className="status">
        <h1>Falta configurar o Firebase</h1>
        <p>Copie o arquivo <code>.env.example</code> para <code>.env</code>, preencha as chaves e reinicie o servidor.</p>
      </main>
    );
  }
  return <main className="status"><h1>Carimbo</h1></main>;
}
