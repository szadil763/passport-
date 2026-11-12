// Botão de alternância para favoritar. Quem não entrou vai para a tela de login.
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { IconHeart } from './Icons';

export default function FavoriteButton({ kind, id, name }) {
  const { user } = useAuth();
  const { has, toggle, error } = useFavorites();
  const { pathname } = useLocation();

  if (!user) {
    return (
      <Link to="/entrar" state={{ from: pathname }} className="fav">
        <IconHeart />
        <span>Entrar para favoritar<span className="sr-only"> {name}</span></span>
      </Link>
    );
  }

  const on = has(kind, id);
  return (
    <>
      <button type="button" className="fav" aria-pressed={on} onClick={() => toggle(kind, id)}>
        <IconHeart filled={on} />
        <span>Favoritar<span className="sr-only"> {name}</span></span>
      </button>
      {error && <span className="error small" role="alert">{error}</span>}
    </>
  );
}
