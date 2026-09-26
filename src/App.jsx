import { Navigate, Route, Routes } from 'react-router-dom';
import { firebaseConfigured } from './firebase';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Roadmap from './pages/Roadmap';
import Destinations from './pages/Destinations';
import Country from './pages/Country';
import Resources from './pages/Resources';

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
        <Route index element={<Roadmap />} />
        <Route path="destinos" element={<Destinations />} />
        <Route path="destinos/:id" element={<Country />} />
        <Route path="recursos" element={<Resources />} />
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
