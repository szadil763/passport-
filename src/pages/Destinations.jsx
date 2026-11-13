// Lista de países, com busca e filtros. Os que falam os idiomas do perfil aparecem primeiro.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCollection } from '../hooks/useFirestore';
import { usePageTitle } from '../hooks/usePageTitle';
import { COST_LABELS, LANGUAGES } from '../data/options';
import { matchesQuery } from '../utils/text';
import { LoadError, Loading } from '../components/LoadState';
import ChipGroup from '../components/ChipGroup';
import CountryCard from '../components/CountryCard';
import SearchField from '../components/SearchField';
import VisaNotice from '../components/VisaNotice';

// Quantos idiomas do país batem com os idiomas do perfil.
export function matchScore(country, myLanguages = []) {
  return (country.languages ?? []).filter((l) => myLanguages.includes(l)).length;
}

const LANGUAGE_FILTERS = [{ id: 'todos', label: 'Todos os idiomas' }, ...LANGUAGES];
const COST_FILTERS = [
  { id: 'todos', label: 'Qualquer custo' },
  ...Object.entries(COST_LABELS).map(([id, label]) => ({ id, label })),
];

export default function Destinations() {
  usePageTitle('Destinos');
  const { profile } = useAuth();
  const { data, loading, error } = useCollection('countries');
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('todos');
  const [cost, setCost] = useState('todos');

  if (loading) return <Loading>Carregando destinos…</Loading>;
  if (error) return <LoadError what="os destinos" />;

  const mine = profile?.languages ?? [];
  const list = data
    .filter((c) => matchesQuery(query, c.name, c.languages, c.summary))
    .filter((c) => language === 'todos' || c.languages?.includes(language))
    .filter((c) => cost === 'todos' || String(c.costLevel) === cost)
    .sort((a, b) => matchScore(b, mine) - matchScore(a, mine) || a.name.localeCompare(b.name, 'pt-BR'));

  const filtering = query || language !== 'todos' || cost !== 'todos';
  const clear = () => {
    setQuery('');
    setLanguage('todos');
    setCost('todos');
  };

  return (
    <section>
      <h1>Destinos</h1>
      <p className="muted">
        {mine.length > 0
          ? 'Os países que falam os idiomas do seu perfil aparecem primeiro.'
          : 'Compare idioma, custo e regras de visto.'}
      </p>
      <p>
        <Link to="/comparar">Comparar países lado a lado</Link> · <Link to="/mitos">Acha que é difícil? Veja mitos e verdades</Link>
      </p>

      <div className="filters">
        <SearchField label="Buscar país" value={query} onChange={setQuery} placeholder="Ex.: Canadá, francês" />
        <p id="rotulo-idioma" className="sr-only">Filtrar por idioma</p>
        <ChipGroup options={LANGUAGE_FILTERS} value={language} onChange={setLanguage} labelledBy="rotulo-idioma" />
        <p id="rotulo-custo" className="sr-only">Filtrar por custo</p>
        <ChipGroup options={COST_FILTERS} value={cost} onChange={setCost} labelledBy="rotulo-custo" />
      </div>

      <p className="small muted" aria-live="polite">
        {list.length === 1 ? '1 destino encontrado' : `${list.length} destinos encontrados`}
        {filtering && <> · <button type="button" className="link-button" onClick={clear}>Limpar filtros</button></>}
      </p>

      {data.length === 0 ? (
        <p className="status">
          Ainda não há destinos cadastrados. Quem cuida do app precisa rodar <code>npm run seed</code>.
        </p>
      ) : list.length === 0 ? (
        <p className="status">Nenhum destino com esses filtros. Mude a busca ou toque em "Limpar filtros".</p>
      ) : (
        <ul className="card-grid">
          {list.map((c) => (
            <li key={c.id}><CountryCard country={c} match={matchScore(c, mine) > 0} /></li>
          ))}
        </ul>
      )}

      <VisaNotice />
    </section>
  );
}
