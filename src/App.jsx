import { Navigate, Route, Routes } from 'react-router-dom';
import { firebaseConfigured } from './firebase';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Profile from './pages/Profile';

function Placeholder({ title }) {
  return <h1>{title}</h1>;
}

function AppRoutes() {
  const { user, profile, profileError, loading } = useAuth();

  if (loading) return <p className="status" role="status">Carregando…</p>;
  if (!user) return <Login />;
  if (profileError) {
    return (
      <main className="status">
        <h1>Não foi possível carregar seu perfil</h1>
        <p>Verifique sua conexão e recarregue a página.</p>
      </main>
    );
  }
  // Primeiro acesso: sem objetivo salvo, mostra o onboarding.
  if (!profile?.goal) return <Profile onboarding />;

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Placeholder title="Meu caminho" />} />
        <Route path="destinos" element={<Placeholder title="Destinos" />} />
        <Route path="recursos" element={<Placeholder title="Recursos" />} />
        <Route path="perfil" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  if (!firebaseConfigured) {
    return (
      <main className="status">
        <h1>Falta configurar o Firebase</h1>
        <p>
          Copie o arquivo <code>.env.example</code> para <code>.env</code>, preencha as chaves e reinicie o
          servidor. O passo a passo está no README.
        </p>
      </main>
    );
  }
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
