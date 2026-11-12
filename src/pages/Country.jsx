// Página de um país: resumo, idiomas, custo, visto, "Bom saber" e links relacionados.
import { Link, useParams } from 'react-router-dom';
import { useCollection, useDocument } from '../hooks/useFirestore';
import { CATEGORIES, COST_LABELS, labelOf } from '../data/options';
import { LoadError, Loading } from '../components/LoadState';
import PlaceRow from '../components/PlaceRow';
import VisaNotice from '../components/VisaNotice';

export default function Country() {
  const { id } = useParams();
  const { data: country, loading, error } = useDocument('countries', id);
  const { data: resources } = useCollection('resources');
  const { data: places } = useCollection('places');

  if (loading) return <Loading />;
  if (error) return <LoadError what="este destino" />;
  if (!country) {
    return (
      <div className="status">
        <h1>Destino não encontrado</h1>
        <Link to="/destinos">Ver todos os destinos</Link>
      </div>
    );
  }

  const countryPlaces = places.filter((p) => p.countryId === id).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  const related = resources.filter((r) => r.countries?.includes(id));
  const updated = country.updatedAt?.toDate?.().toLocaleDateString('pt-BR');

  return (
    <article className="stack">
      <Link to="/destinos" className="back">Voltar para Destinos</Link>

      <header className="country-head">
        <span className="flag" aria-hidden="true">{country.flag}</span>
        <h1>{country.name}</h1>
      </header>
      <p>{country.summary}</p>

      <dl className="facts">
        <div>
          <dt>Idiomas</dt>
          <dd>{country.languages?.join(', ')}</dd>
        </div>
        <div>
          <dt>Nível de custo</dt>
          <dd>{COST_LABELS[country.costLevel]}</dd>
        </div>
      </dl>

      <section className="panel stack" aria-labelledby="titulo-visto">
        <h2 id="titulo-visto">Visto</h2>
        <p><strong>{country.visa?.name}</strong></p>
        <p><strong>Trabalho:</strong> {country.visa?.work}</p>
        {country.visa?.officialUrl && (
          <p>
            <a href={country.visa.officialUrl} target="_blank" rel="noopener noreferrer">
              Abrir o site oficial do governo<span className="sr-only"> (abre em nova aba)</span>
            </a>
          </p>
        )}
        {updated && <p className="small muted">Informação revisada em {updated}.</p>}
      </section>
      <VisaNotice />

      {country.highlights?.length > 0 && (
        <section aria-labelledby="titulo-bom-saber">
          <h2 id="titulo-bom-saber">Bom saber</h2>
          <ul className="bullets">
            {country.highlights.map((h) => <li key={h}>{h}</li>)}
          </ul>
        </section>
      )}

      {countryPlaces.length > 0 && (
        <section aria-labelledby="titulo-lugares">
          <h2 id="titulo-lugares">Lugares em {country.name}</h2>
          <ul className="place-list">
            {countryPlaces.map((p) => <li key={p.id}><PlaceRow place={p} /></li>)}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="titulo-links">
          <h2 id="titulo-links">Links úteis para {country.name}</h2>
          <ul className="resource-list">
            {related.map((r) => (
              <li key={r.id}>
                <a href={r.url} target="_blank" rel="noopener noreferrer">
                  {r.title}<span className="sr-only"> (abre em nova aba)</span>
                </a>
                <span className="resource-meta">
                  <span className="pill">{labelOf(CATEGORIES, r.category)}</span>
                  {r.free && <span className="pill pill--free">Gratuito</span>}
                </span>
                <p>{r.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
