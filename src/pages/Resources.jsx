// Sites curados, com filtro por categoria e opção "Só gratuitos".
import { useState } from 'react';
import { useCollection } from '../hooks/useFirestore';
import { CATEGORIES, labelOf } from '../data/options';
import ChipGroup from '../components/ChipGroup';
import { LoadError, Loading } from '../components/LoadState';

const FILTERS = [{ id: 'todas', label: 'Todas' }, ...CATEGORIES];

export default function Resources() {
  const { data, loading, error } = useCollection('resources');
  const [category, setCategory] = useState('todas');
  const [onlyFree, setOnlyFree] = useState(false);

  if (loading) return <Loading>Carregando recursos…</Loading>;
  if (error) return <LoadError what="os recursos" />;

  const list = data
    .filter((r) => category === 'todas' || r.category === category)
    .filter((r) => !onlyFree || r.free)
    .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));

  return (
    <section>
      <h1>Recursos</h1>
      <p className="muted">Sites e programas selecionados para cada etapa do seu caminho.</p>

      <div className="filters">
        <p id="rotulo-categoria" className="sr-only">Filtrar por categoria</p>
        <ChipGroup options={FILTERS} value={category} onChange={setCategory} labelledBy="rotulo-categoria" />
        <label className="checkbox">
          <input type="checkbox" checked={onlyFree} onChange={(e) => setOnlyFree(e.target.checked)} />
          Só gratuitos
        </label>
      </div>

      <p className="small muted" aria-live="polite">
        {list.length === 1 ? '1 recurso encontrado' : `${list.length} recursos encontrados`}
      </p>

      {list.length === 0 ? (
        <p className="status">Nenhum recurso com esses filtros. Escolha outra categoria ou desmarque "Só gratuitos".</p>
      ) : (
        <ul className="resource-list">
          {list.map((r) => (
            <li key={r.id}>
              <a href={r.url} target="_blank" rel="noopener noreferrer">
                {r.title}<span className="sr-only"> (abre em nova aba)</span>
              </a>
              <span className="resource-meta">
                <span className="pill">{labelOf(CATEGORIES, r.category)}</span>
                {r.free ? <span className="pill pill--free">Gratuito</span> : <span className="pill">Pago ou misto</span>}
              </span>
              <p>{r.description}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
