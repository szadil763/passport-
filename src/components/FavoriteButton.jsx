// Botão de alternância para favoritar um país, lugar ou recurso.
import { useFavorites } from '../hooks/useFavorites';
import { IconHeart } from './Icons';

export default function FavoriteButton({ kind, id, name }) {
  const { has, toggle, error } = useFavorites();
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
