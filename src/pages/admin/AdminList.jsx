// Lista de itens de uma coleção, com busca e atalho para criar um novo.
import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { COLLECTIONS } from '../../admin/schemas';
import { useFreshCollection } from '../../admin/useFresh';
import { usePageTitle } from '../../hooks/usePageTitle';
import { matchesQuery } from '../../utils/text';
import { LoadError, Loading } from '../../components/LoadState';
import SearchField from '../../components/SearchField';

export default function AdminList() {
  const { collection: name } = useParams();
  const cfg = COLLECTIONS[name];
  const { state } = useLocation();
  const { data, loading, error } = useFreshCollection(cfg ? name : 'countries');
  const [query, setQuery] = useState('');
  usePageTitle(cfg ? `Admin: ${cfg.label}` : 'Admin');

  if (!cfg) {
    return (
      <div className="status">
        <h1>Tipo de conteúdo não encontrado</h1>
        <Link to="/admin">Voltar ao painel</Link>
      </div>
    );
  }
  if (loading) return <Loading />;
  if (error) return <LoadError what="os itens" />;

  const list = data
    .filter((d) => matchesQuery(query, d[cfg.titleKey], d.id))
    .sort((a, b) => String(a[cfg.titleKey]).localeCompare(String(b[cfg.titleKey]), 'pt-BR'));

  return (
    <section className="stack">
      <Link to="/admin" className="back">Voltar ao painel</Link>
      <h1>{cfg.label}</h1>
      {state?.saved && <p className="saved" role="status">{state.saved}</p>}
      <p><Link to={`/admin/${name}/novo`} className="btn btn-primary btn-inline">Adicionar {cfg.singular}</Link></p>
      <SearchField label={`Buscar ${cfg.singular}`} value={query} onChange={setQuery} />
      <p className="small muted" aria-live="polite">
        {list.length === 1 ? '1 item' : `${list.length} itens`}
      </p>
      <ul className="resource-list">
        {list.map((d) => (
          <li key={d.id}>
            <Link to={`/admin/${name}/${d.id}`}>{d[cfg.titleKey] || d.id}</Link>
            <span className="resource-meta">
              <span className="pill">{d.id}</span>
              {name === 'calls' && !d.closesAt && <span className="pill pill--soon">Sem prazo cadastrado</span>}
              {name === 'calls' && d.closesAt && <span className="pill">Prazo: {d.closesAt}</span>}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
