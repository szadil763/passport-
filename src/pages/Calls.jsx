// Editais e bolsas, com contagem do prazo e lembrete no calendário (arquivo .ics).
import { useState } from 'react';
import { useCollection } from '../hooks/useFirestore';
import { usePageTitle } from '../hooks/usePageTitle';
import { LEVELS, labelOf } from '../data/options';
import { addDaysIso, daysUntil, deadlineText, formatDate, isIsoDate } from '../utils/dates';
import { buildIcs, downloadIcs } from '../utils/ics';
import { matchesQuery } from '../utils/text';
import { IconCalendar } from '../components/Icons';
import ChipGroup from '../components/ChipGroup';
import FavoriteButton from '../components/FavoriteButton';
import { LoadError, Loading } from '../components/LoadState';
import SearchField from '../components/SearchField';
import SelectField from '../components/SelectField';
import StudyNav from '../components/StudyNav';

const LEVEL_FILTERS = [{ id: 'todos', label: 'Todos os níveis' }, ...LEVELS];

// Lembrete de calendário: para um prazo conhecido, 7 dias antes; senão, na data que a pessoa escolher.
function Reminder({ call, closes }) {
  const [date, setDate] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  function save(day, title) {
    try {
      const ics = buildIcs({
        title,
        description: `${call.title} (${call.organization}). Confirme as datas e os requisitos no site oficial.`,
        url: call.officialUrl,
        date: day,
        uid: `${call.id}-${day}`,
      });
      downloadIcs(`lembrete-${call.id}.ics`, ics);
      setError('');
    } catch {
      setError('Escolha uma data válida.');
    }
  }

  if (closes) {
    const soon = call.days <= 7; // já está perto: lembra no próprio dia do prazo
    const day = soon ? call.closesAt : addDaysIso(call.closesAt, -7);
    const title = soon ? `Hoje fecha o edital ${call.title}` : `Falta 1 semana: edital ${call.title}`;
    return (
      <button type="button" className="fav" onClick={() => save(day, title)}>
        <IconCalendar />
        <span>{soon ? 'Lembrar no dia do prazo' : 'Lembrar 7 dias antes'}<span className="sr-only"> do prazo de {call.title}</span></span>
      </button>
    );
  }

  return (
    <div className="reminder">
      <button type="button" className="fav" aria-expanded={open} onClick={() => setOpen(!open)}>
        <IconCalendar />
        <span>Criar lembrete<span className="sr-only"> para {call.title}</span></span>
      </button>
      {open && (
        <div className="reminder-box">
          <label>
            Quando você quer ser lembrado de conferir?
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <button
            type="button"
            className="btn"
            disabled={!isIsoDate(date)}
            onClick={() => save(date, `Conferir edital ${call.title}`)}
          >
            Baixar lembrete (.ics)
          </button>
          <p className="small muted">Funciona no Google Agenda, no Calendário da Apple e no Outlook.</p>
          {error && <p className="error small" role="alert">{error}</p>}
        </div>
      )}
    </div>
  );
}

export default function Calls() {
  usePageTitle('Editais e bolsas');
  const calls = useCollection('calls');
  const countries = useCollection('countries');
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('todos');
  const [countryId, setCountryId] = useState('todos');

  if (calls.loading || countries.loading) return <Loading>Carregando editais…</Loading>;
  if (calls.error || countries.error) return <LoadError what="os editais" />;

  const byId = Object.fromEntries(countries.data.map((c) => [c.id, c]));
  const countryOptions = [
    { id: 'todos', label: 'Qualquer país' },
    ...countries.data
      .filter((c) => calls.data.some((x) => x.countries?.includes(c.id)))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
      .map((c) => ({ id: c.id, label: `${c.flag} ${c.name}` })),
  ];

  const list = calls.data
    .map((c) => ({ ...c, days: daysUntil(c.closesAt) }))
    .filter((c) => matchesQuery(query, c.title, c.organization, c.description))
    .filter((c) => level === 'todos' || c.levels?.includes(level))
    .filter((c) => countryId === 'todos' || c.countries?.includes(countryId))
    // Prazo aberto primeiro (do mais próximo), depois os sem data, depois os encerrados.
    .sort((a, b) => {
      const rank = (c) => (c.days === null ? 1 : c.days >= 0 ? 0 : 2);
      return rank(a) - rank(b) || (a.days ?? 0) - (b.days ?? 0) || a.title.localeCompare(b.title, 'pt-BR');
    });

  return (
    <section>
      <h1>Editais e bolsas</h1>
      <StudyNav />
      <p className="muted">
        Programas que financiam estudo e pesquisa no exterior. Os prazos mudam a cada ciclo: confirme no site
        oficial e crie um lembrete no calendário.
      </p>

      <div className="filters">
        <SearchField label="Buscar edital" value={query} onChange={setQuery} placeholder="Ex.: Chevening, mestrado" />
        <p id="rotulo-nivel" className="sr-only">Filtrar por nível</p>
        <ChipGroup options={LEVEL_FILTERS} value={level} onChange={setLevel} labelledBy="rotulo-nivel" />
        <SelectField label="País de destino" value={countryId} onChange={setCountryId} options={countryOptions} />
      </div>

      <p className="small muted" aria-live="polite">
        {list.length === 1 ? '1 edital encontrado' : `${list.length} editais encontrados`}
      </p>

      {list.length === 0 ? (
        <p className="status">Nenhum edital com esses filtros. Mude a busca ou o nível.</p>
      ) : (
        <ul className="resource-list">
          {list.map((c) => {
            const closes = c.days !== null;
            return (
              <li key={c.id}>
                <a href={c.officialUrl} target="_blank" rel="noopener noreferrer">
                  {c.title}<span className="sr-only"> (abre em nova aba)</span>
                </a>
                <span className="place-where">
                  {c.organization}
                  {c.countries?.length > 0 && ` · ${c.countries.map((id) => byId[id]?.flag).filter(Boolean).join(' ')}`}
                </span>
                <span className="resource-meta">
                  {c.levels?.map((l) => <span key={l} className="pill">{labelOf(LEVELS, l)}</span>)}
                  {closes && (
                    <span className={`pill ${c.days >= 0 && c.days <= 30 ? 'pill--soon' : ''}`}>{deadlineText(c.days)}</span>
                  )}
                </span>
                <p>{c.description}</p>
                <p className="small muted">
                  {closes
                    ? `Inscrições até ${formatDate(c.closesAt)}. Confirme no site oficial.`
                    : c.datesNote ?? 'Confirme as datas no site oficial.'}
                </p>
                <div className="card-actions">
                  <FavoriteButton kind="calls" id={c.id} name={c.title} />
                  {(!closes || c.days >= 0) && <Reminder call={c} closes={closes} />}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
