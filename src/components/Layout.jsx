// Estrutura das telas logadas: barra superior, conteúdo e barra inferior fixa.
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { IconBook, IconGlobe, IconPath, IconPin, IconUser, Logo } from './Icons';

const TABS = [
  { to: '/', label: 'Meu caminho', Icon: IconPath, end: true },
  { to: '/destinos', label: 'Destinos', Icon: IconGlobe },
  { to: '/lugares', label: 'Lugares', Icon: IconPin },
  { to: '/recursos', label: 'Recursos', Icon: IconBook },
  { to: '/perfil', label: 'Perfil', Icon: IconUser },
];

export default function Layout() {
  const { logout } = useAuth();
  const { pathname } = useLocation();
  const mainRef = useRef(null);

  // Ao trocar de tela: volta ao topo e leva o foco para o conteúdo (ajuda leitores de tela).
  useEffect(() => {
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className="shell">
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <header className="topbar">
        <NavLink to="/" className="brand" aria-label="Carimbo, ir para Meu caminho">
          <Logo />
          Carimbo
        </NavLink>
        <button className="link-button" type="button" onClick={logout}>Sair</button>
      </header>

      <main id="conteudo" className="page" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>

      <nav className="tabbar" aria-label="Navegação principal">
        {TABS.map(({ to, label, Icon, end }) => (
          <NavLink key={to} to={to} end={end}>
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
