// Compara até três países lado a lado. A escolha fica no endereço (?p=canada,irlanda), então dá para compartilhar.
import { Link, useSearchParams } from 'react-router-dom';
import { useCollection } from '../hooks/useFirestore';
import { usePageTitle } from '../hooks/usePageTitle';
import { COST_LABELS } from '../data/options';
import ChipGroup from '../components/ChipGroup';
import CostScale from '../components/CostScale';
import { LoadError, Loading } from '../components/LoadState';
import VisaNotice from '../components/VisaNotice';

const MAX = 3;

export default function Compare() {
  usePageTitle('Comparar países');
  const countries = useCollection('countries');
  const places = useCollection('places');
  const [params, setParams] = useSearchParams();

  if (countries.loading || places.loading) return <Loading />;
  if (countries.error || places.error) return <LoadError what="os países" />;

  const sorted = [...countries.data].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  const valid = new Set(sorted.map((c) => c.id));
  const selected = (params.get('p') ?? '').split(',').filter((id) => valid.has(id)).slice(0, MAX);

  const choose = (ids) => {
    const next = ids.slice(-MAX); // passando de três, sai o mais antigo
    setParams(next.length ? { p: next.join(',') } : {}, { replace: true });
  };

  const chosen = selected.map((id) => countries.data.find((c) => c.id === id));
  const cities = (id) => places.data.filter((p) => p.countryId === id).map((p) => p.name);

  const rows = [
    ['Idiomas', (c) => c.languages?.join(', ')],
    ['Nível de custo', (c) => <CostScale level={c.costLevel} />],
    ['Visto', (c) => c.visa?.name],
    ['Trabalho durante os estudos', (c) => c.work?.students ?? c.visa?.work],
    ['Programas de trabalho', (c) => (c.work?.programs?.length ? c.work.programs.map((p) => p.name).join(', ') : 'Nenhum listado')],
    ['Cidades no app', (c) => cities(c.id).join(', ') || 'Nenhuma ainda'],
  ];

  return (
    <section className="stack">
      <Link to="/destinos" className="back">Voltar para Destinos</Link>
      <h1>Comparar países</h1>
      <p className="muted">Escolha até {MAX} países. Ao escolher o quarto, o mais antigo sai da comparação.</p>

      <p id="rotulo-comparar" className="sr-only">Países para comparar</p>
      <ChipGroup
        options={sorted.map((c) => ({ id: c.id, label: `${c.flag} ${c.name}` }))}
        value={selected}
        onChange={choose}
        multiple
        labelledBy="rotulo-comparar"
      />

      {chosen.length < 2 ? (
        <p className="status">Escolha pelo menos dois países para ver a comparação.</p>
      ) : (
        <div className="table-wrap" tabIndex={0} role="region" aria-label="Tabela de comparação">
          <table className="compare">
            <caption className="sr-only">Comparação entre {chosen.map((c) => c.name).join(', ')}</caption>
            <thead>
              <tr>
                <td />
                {chosen.map((c) => (
                  <th key={c.id} scope="col">
                    <Link to={`/destinos/${c.id}`}>{c.flag} {c.name}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, render]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {chosen.map((c) => <td key={c.id}>{render(c)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="small muted">Custo é uma comparação entre os destinos do app: {Object.values(COST_LABELS).join(', ').toLowerCase()}.</p>
      <VisaNotice />
    </section>
  );
}
