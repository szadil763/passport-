// Início do painel admin: uma entrada por tipo de conteúdo, com a quantidade de itens.
import { Link } from 'react-router-dom';
import { COLLECTIONS, COLLECTION_ORDER } from '../../admin/schemas';
import { useFreshCollection } from '../../admin/useFresh';
import { usePageTitle } from '../../hooks/usePageTitle';

function Entry({ name }) {
  const { data, loading, error } = useFreshCollection(name);
  const cfg = COLLECTIONS[name];
  return (
    <li>
      <Link to={`/admin/${name}`} className="menu-link">
        <strong>{cfg.label}</strong>
        <span>{error ? 'Não foi possível contar' : loading ? 'Contando…' : `${data.length} itens`}</span>
      </Link>
    </li>
  );
}

export default function AdminHome() {
  usePageTitle('Painel admin');
  return (
    <section className="stack">
      <h1>Painel admin</h1>
      <p className="muted">
        Edite os países, as cidades, os cursos, os editais e os recursos sem mexer nos arquivos. As mudanças
        aparecem no site quando a página é recarregada.
      </p>
      <ul className="menu-cards">
        <li>
          <Link to="/admin/acessos" className="menu-link">
            <strong>Acessos ao site</strong>
            <span>Páginas vistas e visitantes por dia</span>
          </Link>
        </li>
        {COLLECTION_ORDER.map((name) => <Entry key={name} name={name} />)}
      </ul>
      <p className="panel small">
        <strong>Atenção com o seed.</strong> O comando <code>npm run seed</code> sobrescreve os itens que
        existem nos arquivos <code>seed/*.json</code> e desfaz o que você editou aqui. Para enviar só os itens
        novos, use <code>npm run seed -- --somente-novos</code>.
      </p>
    </section>
  );
}
