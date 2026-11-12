// Guarda do painel admin: só entra quem tem o documento admins/{uid}.
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loading } from './LoadState';

export default function RequireAdmin({ children }) {
  const { user, isAdmin, adminChecked, loading } = useAuth();
  const { pathname } = useLocation();

  if (loading || (user && !adminChecked)) return <Loading />;
  if (!user) return <Navigate to="/entrar" state={{ from: pathname }} replace />;

  if (!isAdmin) {
    return (
      <div className="stack">
        <h1>Sem acesso ao painel</h1>
        <p>
          Este painel é só para quem cuida do Carimbo. Se é você, peça para a pessoa que administra o projeto
          criar o seu acesso, ou crie você mesmo no console do Firebase:
        </p>
        <ol className="bullets">
          <li>Abra o Firestore Database e toque em <strong>Iniciar coleção</strong> (ou abra a coleção <code>admins</code>).</li>
          <li>Use <code>admins</code> como nome da coleção.</li>
          <li>Em <strong>ID do documento</strong>, cole o seu identificador, que aparece abaixo.</li>
          <li>Crie um campo qualquer, por exemplo <code>ativo</code> com o valor <code>true</code>, e salve.</li>
          <li>Volte aqui e recarregue a página.</li>
        </ol>
        <p className="panel">Seu identificador: <code>{user.uid}</code></p>
        <p><Link to="/">Voltar ao início</Link></p>
      </div>
    );
  }
  return children;
}
