import { firebaseConfigured } from './firebase';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';

function Routes() {
  const { user, loading, logout } = useAuth();
  if (loading) return <p className="status" role="status">Carregando…</p>;
  if (!user) return <Login />;
  return (
    <main className="status">
      <h1>Olá!</h1>
      <button className="btn" onClick={logout}>Sair</button>
    </main>
  );
}

export default function App() {
  if (!firebaseConfigured) {
    return (
      <main className="status">
        <h1>Falta configurar o Firebase</h1>
        <p>Copie o arquivo <code>.env.example</code> para <code>.env</code>, preencha as chaves e reinicie o servidor.</p>
      </main>
    );
  }
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
