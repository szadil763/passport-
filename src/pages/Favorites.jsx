// Tudo o que a pessoa favoritou, em três listas.
import { Link } from 'react-router-dom';
import { useCollection } from '../hooks/useFirestore';
import { useFavorites } from '../hooks/useFavorites';
import { LoadError, Loading } from '../components/LoadState';
import PlaceRow from '../components/PlaceRow';

export default function Favorites() {
  const { favorites } = useFavorites();
  const countries = useCollection('countries');
  const places = useCollection('places');
  const resources = useCollection('resources');

  if (countries.loading || places.loading || resources.loading) return <Loading />;
  if (countries.error || places.error || resources.error) return <LoadError what="seus favoritos" />;

  const pick = (list, ids = []) => list.filter((x) => ids.includes(x.id));
  const favCountries = pick(countries.data, favorites.countries);
  const favPlaces = pick(places.data, favorites.places);
  const favResources = pick(resources.data, favorites.resources);
  const byId = Object.fromEntries(countries.data.map((c) => [c.id, c]));
  const empty = !favCountries.length && !favPlaces.length && !favResources.length;

  return (
    <section className="stack">
      <Link to="/perfil" className="back">Voltar para Perfil</Link>
      <h1>Favoritos</h1>

      {empty && (
        <p className="status">
          Você ainda não favoritou nada. Toque em "Favoritar" na página de um país, de uma cidade ou de um
          recurso.
        </p>
      )}

      {favCountries.length > 0 && (
        <section aria-labelledby="f-paises">
          <h2 id="f-paises">Países</h2>
          <ul className="country-list">
            {favCountries.map((c) => (
              <li key={c.id}>
                <Link to={`/destinos/${c.id}`} className="country-row">
                  <span className="flag" aria-hidden="true">{c.flag}</span>
                  <span className="country-name">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {favPlaces.length > 0 && (
        <section aria-labelledby="f-lugares">
          <h2 id="f-lugares">Lugares</h2>
          <ul className="place-list">
            {favPlaces.map((p) => <li key={p.id}><PlaceRow place={p} country={byId[p.countryId]} /></li>)}
          </ul>
        </section>
      )}

      {favResources.length > 0 && (
        <section aria-labelledby="f-recursos">
          <h2 id="f-recursos">Recursos</h2>
          <ul className="resource-list">
            {favResources.map((r) => (
              <li key={r.id}>
                <a href={r.url} target="_blank" rel="noopener noreferrer">
                  {r.title}<span className="sr-only"> (abre em nova aba)</span>
                </a>
                <p>{r.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}
