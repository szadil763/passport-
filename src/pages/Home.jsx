// Tela inicial. Sem login: apresenta o app e deixa explorar. Com login: mostra o próximo passo,
// os países que combinam com o perfil e as oportunidades de estudo.
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCollection } from '../hooks/useFirestore';
import { usePageTitle } from '../hooks/usePageTitle';
import { stepsFor } from '../data/roadmap';
import { CERTIFICATES, labelOf, PRICE_TYPES } from '../data/options';
import { daysUntil, deadlineText } from '../utils/dates';
import { MYTHS } from '../data/myths';
import { Logo } from '../components/Icons';
import CountryCard from '../components/CountryCard';
import { Loading } from '../components/LoadState';
import { matchScore } from './Destinations';

const HOW = [
  { title: 'Explore', text: 'Compare países, cidades, cursos e bolsas, sem precisar de conta.' },
  { title: 'Monte seu caminho', text: 'Crie uma conta grátis e siga um passo a passo até a chegada.' },
  { title: 'Ganhe carimbos', text: 'Cada etapa concluída vira um carimbo no seu passaporte.' },
];

function Landing() {
  usePageTitle('');
  const countries = useCollection('countries');
  const places = useCollection('places');
  const courses = useCollection('courses');
  const calls = useCollection('calls');
  const resources = useCollection('resources');
  const channels = useCollection('channels');

  const stats = [
    ['destinos', countries.data.length],
    ['cidades', places.data.length],
    ['cursos online', courses.data.length],
    ['editais', calls.data.length],
    ['canais', channels.data.length],
    ['recursos', resources.data.length],
  ].filter(([, n]) => n > 0);

  const featured = [...countries.data].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')).slice(0, 6);

  return (
    <div className="stack landing">
      <section className="hero">
        <Logo className="hero-stamp" />
        <h1>Seu passaporte para estudar e trabalhar fora.</h1>
        <p className="muted">
          Estudar fora é mais possível do que parece, com ou sem dinheiro. Veja destinos, cidades, cursos
          online, bolsas e um passo a passo até a chegada. Tudo em português, com links oficiais.
        </p>
        <div className="hero-actions">
          <Link to="/destinos" className="btn btn-primary">Explorar destinos</Link>
          <Link to="/entrar" className="btn">Criar conta grátis</Link>
        </div>
      </section>

      {stats.length > 0 && (
        <ul className="stats" aria-label="O que o app tem hoje">
          {stats.map(([label, n]) => (
            <li key={label}><strong>{n}</strong> {label}</li>
          ))}
        </ul>
      )}

      <section className="panel myth-panel" aria-labelledby="mitos-home">
        <h2 id="mitos-home">Mito: estudar fora é para poucos</h2>
        <p>
          Existem caminhos com pouco ou nenhum custo. E conseguir uma bolsa lá fora pode ser mais acessível do
          que parece: muitas instituições avaliam a sua história completa, e não só uma prova longa.
        </p>
        <ul className="bullets">
          {MYTHS.slice(0, 3).map((m) => <li key={m.id}><strong>Mito:</strong> {m.myth}</li>)}
        </ul>
        <p><Link to="/mitos" className="btn btn-primary btn-inline">Ver mitos e verdades</Link></p>
      </section>

      <section aria-labelledby="como-funciona">
        <h2 id="como-funciona">Como funciona</h2>
        <ol className="how">
          {HOW.map((h, i) => (
            <li key={h.title} className="how-step">
              <span className="how-number" aria-hidden="true">{i + 1}</span>
              <span><strong>{h.title}.</strong> {h.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="destaques">
        <h2 id="destaques">Destinos</h2>
        {countries.loading ? (
          <Loading blocks={3}>Carregando destinos…</Loading>
        ) : (
          <ul className="card-grid">
            {featured.map((c) => <li key={c.id}><CountryCard country={c} /></li>)}
          </ul>
        )}
        <p><Link to="/destinos">Ver todos os destinos</Link></p>
      </section>

      <section className="panel" aria-labelledby="estudar-daqui">
        <h2 id="estudar-daqui">Dá para começar de casa</h2>
        <p>
          Faça <Link to="/cursos">cursos online</Link> de universidades do exterior, acompanhe{' '}
          <Link to="/editais">editais de bolsa</Link> e prepare o idioma antes de embarcar.
        </p>
      </section>

      <p className="small muted">
        As informações são reunidas de fontes oficiais, mas regras mudam. Confirme sempre no site do governo ou
        da instituição.
      </p>
    </div>
  );
}

function Dashboard() {
  usePageTitle('Início');
  const { user, profile } = useAuth();
  const countries = useCollection('countries');
  const calls = useCollection('calls');
  const courses = useCollection('courses');

  const steps = stepsFor(profile.goal);
  const done = profile.roadmap ?? {};
  const count = steps.filter((s) => done[s.id]).length;
  const next = steps.find((s) => !done[s.id]);
  const first = user?.displayName?.split(' ')[0];

  const mine = profile.languages ?? [];
  const suggested = [...countries.data]
    .filter((c) => matchScore(c, mine) > 0)
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
    .slice(0, 3);

  // Editais com prazo ainda aberto vêm primeiro, do mais próximo ao mais distante.
  const dated = calls.data
    .map((c) => ({ ...c, days: daysUntil(c.closesAt) }))
    .filter((c) => c.days !== null && c.days >= 0)
    .sort((a, b) => a.days - b.days);
  const callList = (dated.length ? dated : calls.data).slice(0, 3);

  const freeCourses = courses.data
    .filter((c) => c.priceType === 'gratuito' && (c.languages ?? []).some((l) => mine.includes(l)))
    .slice(0, 3);

  return (
    <div className="stack">
      <h1>{first ? `Olá, ${first}` : 'Olá'}</h1>

      <section className="panel next" aria-labelledby="proximo">
        <h2 id="proximo">{next ? 'Seu próximo passo' : 'Passaporte completo'}</h2>
        <p className="progress-label">{count} de {steps.length} carimbos</p>
        <div className="progress-bar" aria-hidden="true">
          <span style={{ width: `${(count / steps.length) * 100}%` }} />
        </div>
        {next ? (
          <>
            <p><strong>{next.title}.</strong> {next.hint}</p>
            <Link to="/caminho" className="btn btn-primary">Abrir meu caminho</Link>
          </>
        ) : (
          <p>Você concluiu todas as etapas. Boa viagem!</p>
        )}
      </section>

      {suggested.length > 0 && (
        <section aria-labelledby="para-voce">
          <h2 id="para-voce">Países para você</h2>
          <ul className="card-grid">
            {suggested.map((c) => <li key={c.id}><CountryCard country={c} match /></li>)}
          </ul>
          <p><Link to="/destinos">Ver todos os destinos</Link></p>
        </section>
      )}

      {callList.length > 0 && (
        <section aria-labelledby="editais-home">
          <h2 id="editais-home">{dated.length ? 'Editais fechando em breve' : 'Editais e bolsas'}</h2>
          <ul className="resource-list">
            {callList.map((c) => (
              <li key={c.id}>
                <Link to="/editais">{c.title}</Link>
                <span className="resource-meta">
                  <span className="pill">{c.organization}</span>
                  {c.days != null && <span className="pill pill--soon">{deadlineText(c.days)}</span>}
                </span>
              </li>
            ))}
          </ul>
          <p><Link to="/editais">Ver todos os editais</Link></p>
        </section>
      )}

      {freeCourses.length > 0 && (
        <section aria-labelledby="cursos-home">
          <h2 id="cursos-home">Cursos gratuitos nos seus idiomas</h2>
          <ul className="resource-list">
            {freeCourses.map((c) => (
              <li key={c.id}>
                <a href={c.officialUrl} target="_blank" rel="noopener noreferrer">
                  {c.title}<span className="sr-only"> (abre em nova aba)</span>
                </a>
                <span className="resource-meta">
                  <span className="pill pill--free">{labelOf(PRICE_TYPES, c.priceType)}</span>
                  <span className="pill">{CERTIFICATES[c.certificate]}</span>
                </span>
              </li>
            ))}
          </ul>
          <p><Link to="/cursos">Ver todos os cursos online</Link></p>
        </section>
      )}

      <p>
        <Link to="/mitos">Mitos e verdades</Link> · <Link to="/favoritos">Meus favoritos</Link> ·{' '}
        <Link to="/orcamento">Meu orçamento</Link>
      </p>
    </div>
  );
}

export default function Home() {
  const { user, profile, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Landing />;
  if (!profile?.goal) return <Navigate to="/perfil" replace />;
  return <Dashboard />;
}
