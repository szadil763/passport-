import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { firebaseConfigured } from './firebase';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import { Loading } from './components/LoadState';
import RequireAdmin from './components/RequireAdmin';
import About from './pages/About';
import AdminEdit from './pages/admin/AdminEdit';
import AdminHome from './pages/admin/AdminHome';
import AdminStats from './pages/admin/AdminStats';
import AdminList from './pages/admin/AdminList';
import Budget from './pages/Budget';
import Calls from './pages/Calls';
import Channels from './pages/Channels';
import Compare from './pages/Compare';
import Country from './pages/Country';
import Courses from './pages/Courses';
import Destinations from './pages/Destinations';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import Myths from './pages/Myths';
import Login from './pages/Login';
import Place from './pages/Place';
import Places from './pages/Places';
import Profile from './pages/Profile';
import Resources from './pages/Resources';
import Roadmap from './pages/Roadmap';

// Telas pessoais: exigem login. Quem ainda não escolheu um objetivo faz o onboarding primeiro.
function RequireAuth({ children }) {
  const { user, profile, profileError, loading } = useAuth();
  const { pathname } = useLocation();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/entrar" state={{ from: pathname }} replace />;
  if (profileError) {
    return (
      <div className="status">
        <h1>Não foi possível carregar seu perfil</h1>
        <p>Verifique sua conexão e recarregue a página.</p>
      </div>
    );
  }
  if (!profile?.goal) return <Profile onboarding />;
  return children;
}

function NotFound() {
  return (
    <div className="status">
      <h1>Página não encontrada</h1>
      <p><Link to="/">Voltar ao início</Link></p>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="entrar" element={<Login />} />
      <Route element={<Layout />}>
        {/* Públicas */}
        <Route index element={<Home />} />
        <Route path="destinos" element={<Destinations />} />
        <Route path="destinos/:id" element={<Country />} />
        <Route path="comparar" element={<Compare />} />
        <Route path="lugares" element={<Places />} />
        <Route path="lugares/:id" element={<Place />} />
        <Route path="cursos" element={<Courses />} />
        <Route path="editais" element={<Calls />} />
        <Route path="canais" element={<Channels />} />
        <Route path="recursos" element={<Resources />} />
        <Route path="mitos" element={<Myths />} />
        <Route path="sobre" element={<About />} />
        {/* Pessoais */}
        <Route path="caminho" element={<RequireAuth><Roadmap /></RequireAuth>} />
        <Route path="orcamento" element={<RequireAuth><Budget /></RequireAuth>} />
        <Route path="favoritos" element={<RequireAuth><Favorites /></RequireAuth>} />
        <Route path="perfil" element={<RequireAuth><Profile /></RequireAuth>} />
        {/* Painel admin: só quem tem o documento admins/{uid} */}
        <Route path="admin" element={<RequireAdmin><AdminHome /></RequireAdmin>} />
        <Route path="admin/acessos" element={<RequireAdmin><AdminStats /></RequireAdmin>} />
        <Route path="admin/:collection" element={<RequireAdmin><AdminList /></RequireAdmin>} />
        <Route path="admin/:collection/:id" element={<RequireAdmin><AdminEdit /></RequireAdmin>} />
        <Route path="*" element={<NotFound />} />
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
