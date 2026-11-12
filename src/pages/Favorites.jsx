// Tudo o que a pessoa favoritou, em três listas.
import { Link } from 'react-router-dom';
import { useCollection } from '../hooks/useFirestore';
import { useFavorites } from '../hooks/useFavorites';
import { LoadError, Loading } from '../components/LoadState';
import { usePageTitle } from '../hooks/usePageTitle';
import CountryCard from '../components/CountryCard';
import PlaceRow from '../components/PlaceRow';

export default function Favorites() {
  usePageTitle('Favoritos');
  const { favorites } = useFavorites();
  const countries = useCollection('countries');
  const places = useCollection('places');
  const resources = useCollection('resources');
  const courses = useCollection('courses');
  const calls = useCollection('calls');
  const channels = useCollection('channels');

  if (countries.loading || places.loading || resources.loading || courses.loading || calls.loading || channels.loading) return <Loading />;
  if (countries.error || places.error || resources.error || courses.error || calls.error || channels.error) return <LoadError what="seus favoritos" />;

  const pick = (list, ids = []) => list.filter((x) => ids.includes(x.id));
  const favCountries = pick(countries.data, favorites.countries);
  const favPlaces = pick(places.data, favorites.places);
  const favResources = pick(resources.data, favorites.resources);
  const favCourses = pick(courses.data, favorites.courses);
  const favCalls = pick(calls.data, favorites.calls);
  const favChannels = pick(channels.data, favorites.channels);
  const byId = Object.fromEntries(countries.data.map((c) => [c.id, c]));
  const empty = ![favCountries, favPlaces, favResources, favCourses, favCalls, favChannels].some((l) => l.length);

  return (
    <section className="stack">
      <Link to="/perfil" className="back">Voltar para Perfil</Link>
      <h1>Favoritos</h1>

      {empty && (
        <p className="status">
          Você ainda não favoritou nada. Toque em "Favoritar" na página de um país, de uma cidade, de um
          curso, de um edital ou de um recurso.
        </p>
      )}

      {favCountries.length > 0 && (
        <section aria-labelledby="f-paises">
          <h2 id="f-paises">Países</h2>
          <ul className="card-grid">
            {favCountries.map((c) => <li key={c.id}><CountryCard country={c} /></li>)}
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

      {favCourses.length > 0 && (
        <section aria-labelledby="f-cursos">
          <h2 id="f-cursos">Cursos online</h2>
          <ul className="resource-list">
            {favCourses.map((c) => (
              <li key={c.id}>
                <a href={c.officialUrl} target="_blank" rel="noopener noreferrer">
                  {c.title}<span className="sr-only"> (abre em nova aba)</span>
                </a>
                <p>{c.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {favCalls.length > 0 && (
        <section aria-labelledby="f-editais">
          <h2 id="f-editais">Editais e bolsas</h2>
          <ul className="resource-list">
            {favCalls.map((c) => (
              <li key={c.id}>
                <a href={c.officialUrl} target="_blank" rel="noopener noreferrer">
                  {c.title}<span className="sr-only"> (abre em nova aba)</span>
                </a>
                <p>{c.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {favChannels.length > 0 && (
        <section aria-labelledby="f-canais">
          <h2 id="f-canais">Canais do YouTube</h2>
          <ul className="resource-list">
            {favChannels.map((c) => (
              <li key={c.id}>
                <a href={c.url} target="_blank" rel="noopener noreferrer">
                  {c.name}<span className="sr-only"> (abre em nova aba)</span>
                </a>
                <p>{c.description}</p>
              </li>
            ))}
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
