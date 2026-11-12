// Dicas de cidades: filtre por país e por objetivo.
import { useState } from 'react';
import { useCollection } from '../hooks/useFirestore';
import { GOALS } from '../data/options';
import ChipGroup from '../components/ChipGroup';
import PlaceRow from '../components/PlaceRow';
import { LoadError, Loading } from '../components/LoadState';

export default function Places() {
  const places = useCollection('places');
  const countries = useCollection('countries');
  const [countryId, setCountryId] = useState('todos');
  const [goal, setGoal] = useState('todos');

  if (places.loading || countries.loading) return <Loading>Carregando lugares…</Loading>;
  if (places.error || countries.error) return <LoadError what="os lugares" />;

  const byId = Object.fromEntries(countries.data.map((c) => [c.id, c]));
  const countryOptions = [
    { id: 'todos', label: 'Todos os países' },
    ...countries.data
      .filter((c) => places.data.some((p) => p.countryId === c.id))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
      .map((c) => ({ id: c.id, label: `${c.flag} ${c.name}` })),
  ];
  const goalOptions = [{ id: 'todos', label: 'Qualquer objetivo' }, ...GOALS];

  const list = places.data
    .filter((p) => countryId === 'todos' || p.countryId === countryId)
    .filter((p) => goal === 'todos' || p.goals?.includes(goal))
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

  return (
    <section>
      <h1>Lugares</h1>
      <p className="muted">Cidades para estudar, trabalhar e morar, com dicas de cada uma.</p>

      <div className="filters">
        <p id="rotulo-pais" className="sr-only">Filtrar por país</p>
        <ChipGroup options={countryOptions} value={countryId} onChange={setCountryId} labelledBy="rotulo-pais" />
        <p id="rotulo-objetivo" className="sr-only">Filtrar por objetivo</p>
        <ChipGroup options={goalOptions} value={goal} onChange={setGoal} labelledBy="rotulo-objetivo" />
      </div>

      <p className="small muted" aria-live="polite">
        {list.length === 1 ? '1 lugar encontrado' : `${list.length} lugares encontrados`}
      </p>

      {list.length === 0 ? (
        <p className="status">Nenhum lugar com esses filtros. Escolha outro país ou outro objetivo.</p>
      ) : (
        <ul className="place-list">
          {list.map((p) => (
            <li key={p.id}><PlaceRow place={p} country={byId[p.countryId]} /></li>
          ))}
        </ul>
      )}
    </section>
  );
}
