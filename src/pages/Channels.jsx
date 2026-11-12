// Canais do YouTube sobre estudar, trabalhar e viver fora. Filtros por assunto e por país.
import { useState } from 'react';
import { useCollection } from '../hooks/useFirestore';
import { usePageTitle } from '../hooks/usePageTitle';
import { CHANNEL_KINDS, CHANNEL_TOPICS, labelOf } from '../data/options';
import { matchesQuery } from '../utils/text';
import ChipGroup from '../components/ChipGroup';
import FavoriteButton from '../components/FavoriteButton';
import { LoadError, Loading } from '../components/LoadState';
import SearchField from '../components/SearchField';
import SelectField from '../components/SelectField';
import StudyNav from '../components/StudyNav';

const TOPIC_FILTERS = [{ id: 'todos', label: 'Todos os assuntos' }, ...CHANNEL_TOPICS];

export default function Channels() {
  usePageTitle('Canais do YouTube');
  const channels = useCollection('channels');
  const countries = useCollection('countries');
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('todos');
  const [countryId, setCountryId] = useState('todos');

  if (channels.loading || countries.loading) return <Loading>Carregando canais…</Loading>;
  if (channels.error || countries.error) return <LoadError what="os canais" />;

  const byId = Object.fromEntries(countries.data.map((c) => [c.id, c]));
  const countryOptions = [
    { id: 'todos', label: 'Qualquer país' },
    ...countries.data
      .filter((c) => channels.data.some((x) => x.countries?.includes(c.id)))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
      .map((c) => ({ id: c.id, label: `${c.flag} ${c.name}` })),
  ];

  const list = channels.data
    .filter((c) => matchesQuery(query, c.name, c.description))
    .filter((c) => topic === 'todos' || c.topics?.includes(topic))
    // Canais de um país específico aparecem quando o filtro é esse país; os gerais valem para todos.
    .filter((c) => countryId === 'todos' || !c.countries?.length || c.countries.includes(countryId))
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

  return (
    <section>
      <h1>Canais do YouTube</h1>
      <StudyNav />
      <p className="muted">
        Criadores e instituições que falam de bolsas, intercâmbio, trabalho, voluntariado e vida no exterior.
        Os links abrem o YouTube.
      </p>

      <div className="filters">
        <SearchField label="Buscar canal" value={query} onChange={setQuery} placeholder="Ex.: bolsas, Canadá" />
        <p id="rotulo-assunto" className="sr-only">Filtrar por assunto</p>
        <ChipGroup options={TOPIC_FILTERS} value={topic} onChange={setTopic} labelledBy="rotulo-assunto" />
        <SelectField label="País" value={countryId} onChange={setCountryId} options={countryOptions} />
      </div>

      <p className="small muted" aria-live="polite">
        {list.length === 1 ? '1 canal encontrado' : `${list.length} canais encontrados`}
      </p>

      {list.length === 0 ? (
        <p className="status">Nenhum canal com esses filtros. Mude o assunto ou o país.</p>
      ) : (
        <ul className="resource-list">
          {list.map((c) => (
            <li key={c.id}>
              <a href={c.url} target="_blank" rel="noopener noreferrer">
                {c.name}<span className="sr-only"> (abre em nova aba)</span>
              </a>
              <span className="resource-meta">
                <span className={`pill${c.kind === 'agencia' ? ' pill--soon' : ''}`}>{labelOf(CHANNEL_KINDS, c.kind)}</span>
                {c.topics?.map((t) => <span key={t} className="pill">{labelOf(CHANNEL_TOPICS, t)}</span>)}
                {c.countries?.length > 0 && c.countries.length <= 2 && (
                  <span className="pill">{c.countries.map((id) => byId[id]?.flag).filter(Boolean).join(' ')}</span>
                )}
              </span>
              <p>{c.description}</p>
              {c.note && <p className="small muted">{c.note}</p>}
              <FavoriteButton kind="channels" id={c.id} name={c.name} />
            </li>
          ))}
        </ul>
      )}
      <p className="small muted">
        O Carimbo não tem vínculo com os canais. Opinião e preço de quem vende mentoria ou pacote são deles:
        compare e confirme as regras nos sites oficiais.
      </p>
    </section>
  );
}
