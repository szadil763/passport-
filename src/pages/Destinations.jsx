// Lista de países. Os que falam os idiomas do perfil aparecem primeiro.
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCollection } from '../hooks/useFirestore';
import { COST_LABELS } from '../data/options';
import { LoadError, Loading } from '../components/LoadState';
import VisaNotice from '../components/VisaNotice';

// Quantos idiomas do país batem com os idiomas do perfil.
export function matchScore(country, myLanguages = []) {
  return (country.languages ?? []).filter((l) => myLanguages.includes(l)).length;
}

export default function Destinations() {
  const { profile } = useAuth();
  const { data, loading, error } = useCollection('countries');

  if (loading) return <Loading>Carregando destinos…</Loading>;
  if (error) return <LoadError what="os destinos" />;

  const mine = profile?.languages ?? [];
  const sorted = [...data].sort(
    (a, b) => matchScore(b, mine) - matchScore(a, mine) || a.name.localeCompare(b.name, 'pt-BR')
  );

  return (
    <section>
      <h1>Destinos</h1>
      <p className="muted">Os países que falam os idiomas do seu perfil aparecem primeiro.</p>

      {sorted.length === 0 ? (
        <p className="status">
          Ainda não há destinos cadastrados. Quem cuida do app precisa rodar <code>npm run seed</code>.
        </p>
      ) : (
        <ul className="country-list">
          {sorted.map((c) => (
            <li key={c.id}>
              <Link to={`/destinos/${c.id}`} className="country-row">
                <span className="flag" aria-hidden="true">{c.flag}</span>
                <span className="country-name">{c.name}</span>
                <span className="country-meta">
                  <span>{c.languages?.join(', ')}</span>
                  <span>{COST_LABELS[c.costLevel]}</span>
                  {matchScore(c, mine) > 0 && <span className="badge">Combina com você</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <VisaNotice />
    </section>
  );
}
