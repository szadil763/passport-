// Acessos ao site: hoje, últimos 7 e 30 dias, por dia e por seção. Dados anônimos (stats/AAAA-MM-DD).
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, documentId, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { dayKey, summarize } from '../../utils/analytics';
import { usePageTitle } from '../../hooks/usePageTitle';
import { LoadError, Loading } from '../../components/LoadState';

const fmt = (n) => n.toLocaleString('pt-BR');
const fmtDay = (key) => key.split('-').reverse().join('/');

function Total({ label, data }) {
  return (
    <div className="stat">
      <span className="stat-label">{label}</span>
      <strong>{fmt(data.views)}</strong>
      <span className="small muted">{fmt(data.visitors)} {data.visitors === 1 ? 'visitante' : 'visitantes'}</span>
    </div>
  );
}

export default function AdminStats() {
  usePageTitle('Admin: acessos');
  const [state, setState] = useState({ docs: [], loading: true, error: null });

  useEffect(() => {
    let active = true;
    // Só os últimos 60 dias (o cache local do navegador não aceita ordenação descendente por id).
    const since = dayKey(new Date(Date.now() - 60 * 86400000));
    getDocs(query(collection(db, 'stats'), where(documentId(), '>=', since)))
      .then((snap) => active && setState({ docs: snap.docs.map((d) => ({ id: d.id, ...d.data() })), loading: false, error: null }))
      .catch((error) => {
        console.error('Acessos:', error?.code, error?.message);
        if (active) setState({ docs: [], loading: false, error });
      });
    return () => {
      active = false;
    };
  }, []);

  if (state.loading) return <Loading />;
  if (state.error) return <LoadError what="os acessos" />;

  const r = summarize(state.docs);
  const maxDay = Math.max(1, ...r.days.map((d) => d.views));
  const maxSection = Math.max(1, ...r.sections.map((s) => s.views));

  return (
    <section className="stack">
      <Link to="/admin" className="back">Voltar ao painel</Link>
      <h1>Acessos ao site</h1>
      <p className="muted">
        <strong>Páginas vistas</strong> contam cada tela aberta. <strong>Visitantes</strong> contam cada navegador
        uma vez por dia. As suas próprias visitas como admin não entram. Os dados são anônimos.
      </p>

      <div className="stats-grid">
        <Total label="Hoje" data={r.today} />
        <Total label="Últimos 7 dias" data={r.last7} />
        <Total label="Últimos 30 dias" data={r.last30} />
      </div>

      {state.docs.length === 0 && (
        <p className="status">Ainda não há acessos registrados. Eles aparecem aqui assim que alguém abrir o site.</p>
      )}

      {r.days.length > 0 && (
        <section aria-labelledby="por-dia">
          <h2 id="por-dia">Por dia (últimos 30 dias)</h2>
          <ul className="bars">
            {r.days.map((d) => (
              <li key={d.day}>
                <span className="bar-label">{fmtDay(d.day)}</span>
                <span className="bar-track" aria-hidden="true"><span style={{ width: `${(d.views / maxDay) * 100}%` }} /></span>
                <span className="bar-value">{fmt(d.views)} · {fmt(d.visitors)}</span>
              </li>
            ))}
          </ul>
          <p className="small muted">Cada linha mostra páginas vistas · visitantes.</p>
        </section>
      )}

      {r.last30.views > 0 && (
        <section aria-labelledby="por-secao">
          <h2 id="por-secao">Telas mais vistas (30 dias)</h2>
          <ul className="bars">
            {r.sections.map((s) => (
              <li key={s.field}>
                <span className="bar-label wide">{s.label}</span>
                <span className="bar-track" aria-hidden="true"><span style={{ width: `${(s.views / maxSection) * 100}%` }} /></span>
                <span className="bar-value">{fmt(s.views)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}
