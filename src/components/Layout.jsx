// Estrutura das telas: barra superior, conteúdo e barra inferior fixa.
// As telas de conteúdo são públicas; quem não entrou vê "Entrar" no topo e na barra inferior.
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AUTHOR } from '../data/credits';
import { IconBook, IconGlobe, IconHome, IconPin, IconUser, Logo } from './Icons';

const starts = (...prefixes) => (path) => prefixes.some((p) => path === p || path.startsWith(`${p}/`));

export default function Layout() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const mainRef = useRef(null);

  // Ao trocar de tela: volta ao topo e leva o foco para o conteúdo (ajuda leitores de tela).
  useEffect(() => {
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  const tabs = [
    { to: '/', label: 'Início', Icon: IconHome, active: (p) => p === '/' || starts('/caminho')(p) },
    { to: '/destinos', label: 'Destinos', Icon: IconGlobe, active: starts('/destinos', '/comparar') },
    { to: '/lugares', label: 'Lugares', Icon: IconPin, active: starts('/lugares') },
    { to: '/cursos', label: 'Estudar', Icon: IconBook, active: starts('/cursos', '/editais', '/recursos') },
    user
      ? { to: '/perfil', label: 'Perfil', Icon: IconUser, active: starts('/perfil', '/favoritos', '/orcamento') }
      : { to: '/entrar', label: 'Entrar', Icon: IconUser, active: starts('/entrar') },
  ];

  return (
    <div className="shell">
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <header className="topbar">
        <NavLink to="/" className="brand" aria-label="Carimbo, ir para o início">
          <Logo />
          Carimbo
        </NavLink>
        {user ? (
          <button className="link-button" type="button" onClick={logout}>Sair</button>
        ) : (
          <Link className="topbar-link" to="/entrar" state={{ from: pathname }}>Entrar</Link>
        )}
      </header>

      <main id="conteudo" className="page" ref={mainRef} tabIndex={-1}>
        <Outlet />
        <footer className="site-footer">
          <p>Feito para alunos e para quem quer expandir o conhecimento e as fronteiras.</p>
          <p>
            {AUTHOR && <>Desenvolvido por {AUTHOR} · </>}
            <Link to="/sobre">Sobre e créditos</Link>
          </p>
        </footer>
      </main>

      <nav className="tabbar" aria-label="Navegação principal">
        {tabs.map(({ to, label, Icon, active }) => {
          const current = active(pathname);
          return (
            <Link key={to} to={to} className={current ? 'active' : undefined} aria-current={current ? 'page' : undefined}>
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
