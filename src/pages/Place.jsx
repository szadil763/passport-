// Página de uma cidade: dicas para estudar, trabalhar e morar, com links das universidades.
import { Link, useParams } from 'react-router-dom';
import { useDocument } from '../hooks/useFirestore';
import { GOALS, labelOf } from '../data/options';
import { usePageTitle } from '../hooks/usePageTitle';
import ShareButton from '../components/ShareButton';
import FavoriteButton from '../components/FavoriteButton';
import { LoadError, Loading } from '../components/LoadState';

const SECTIONS = [
  { key: 'study', title: 'Estudar' },
  { key: 'work', title: 'Trabalhar' },
  { key: 'living', title: 'Morar' },
];

export default function Place() {
  const { id } = useParams();
  const place = useDocument('places', id);
  const countryId = place.data?.countryId;
  // Só busca o país depois de saber qual é (id vazio devolve "não encontrado").
  const country = useDocument('countries', countryId ?? '_');
  usePageTitle(place.data?.name);

  if (place.loading) return <Loading />;
  if (place.error) return <LoadError what="este lugar" />;
  if (!place.data) {
    return (
      <div className="status">
        <h1>Lugar não encontrado</h1>
        <Link to="/lugares">Ver todos os lugares</Link>
      </div>
    );
  }

  const p = place.data;
  const c = country.data;

  return (
    <article className="stack">
      <Link to="/lugares" className="back">Voltar para Lugares</Link>
      <header>
        <h1>{p.name}</h1>
        {c && (
          <p className="place-where">
            <Link to={`/destinos/${c.id}`}>{c.flag} {c.name}</Link>
          </p>
        )}
        <div className="head-actions">
          <FavoriteButton kind="places" id={p.id} name={p.name} />
          <ShareButton title={p.name} text={`${p.name}: dicas para estudar, trabalhar e morar, no Carimbo.`} />
        </div>
      </header>
      <p>{p.summary}</p>

      <dl className="facts">
        {p.costNote && (
          <div>
            <dt>Custo de vida</dt>
            <dd>{p.costNote}</dd>
          </div>
        )}
        {p.goals?.length > 0 && (
          <div>
            <dt>Bom para</dt>
            <dd>{p.goals.map((g) => labelOf(GOALS, g)).join(', ')}</dd>
          </div>
        )}
      </dl>

      <div className="place-sections">
        {SECTIONS.filter((s) => p[s.key]?.length > 0).map((s) => (
          <section key={s.key} aria-labelledby={`t-${s.key}`}>
            <h2 id={`t-${s.key}`}>{s.title}</h2>
            <ul className="bullets">
              {p[s.key].map((tip) => <li key={tip}>{tip}</li>)}
            </ul>
          </section>
        ))}
      </div>

      {p.universities?.length > 0 && (
        <section aria-labelledby="t-univ">
          <h2 id="t-univ">Universidades</h2>
          <ul className="link-list">
            {p.universities.map((u) => (
              <li key={u.url}>
                <a href={u.url} target="_blank" rel="noopener noreferrer">
                  {u.name}<span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="small muted">
        Dicas gerais, sem valores. Confirme custos, regras de trabalho e de visto nos sites oficiais.
      </p>
    </article>
  );
}
