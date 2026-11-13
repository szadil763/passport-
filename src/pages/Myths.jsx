// Mitos e verdades: desmistifica a ideia de que estudar fora é impossível, com ou sem dinheiro.
import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import {
  HOLISTIC,
  HOLISTIC_CAVEAT,
  MYTHS,
  NEED_BLIND,
  REALITY,
  SINGLE_EXAM,
  WITHOUT_MONEY,
  WITH_MONEY,
} from '../data/myths';
import ShareButton from '../components/ShareButton';

function LinkList({ items }) {
  return (
    <ul className="bullets">
      {items.map((i) => (
        <li key={i.text}>
          {i.text} <Link to={i.to}>{i.label}</Link>
        </li>
      ))}
    </ul>
  );
}

export default function Myths() {
  usePageTitle('Mitos e verdades sobre estudar fora');
  return (
    <article className="stack myths">
      <header>
        <h1>Estudar fora é mais possível do que parece</h1>
        <p className="lead">
          Há vários caminhos, com ou sem dinheiro. Vamos separar o que é mito do que é verdade.
        </p>
        <ShareButton
          title="Estudar fora é mais possível do que parece"
          text="Mitos e verdades sobre estudar no exterior, com ou sem dinheiro."
        />
      </header>

      <section aria-labelledby="mitos">
        <h2 id="mitos">Mitos e verdades</h2>
        <ul className="myth-list">
          {MYTHS.map((m) => (
            <li key={m.id} className="myth-card">
              <p className="myth"><span className="tag tag--myth">Mito</span> {m.myth}</p>
              <p className="truth"><span className="tag tag--truth">Verdade</span> {m.truth}</p>
              <p className="myth-links">
                {m.links.map((l) => <Link key={l.to + l.label} to={l.to}>{l.label}</Link>)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="holistico-titulo" id="holistico">
        <h2 id="holistico-titulo">Prova única ou processo holístico</h2>
        <p>
          Em muitas seleções no Brasil, uma prova longa decide a vaga. Em muitas instituições estrangeiras, a
          seleção é holística: a banca lê a candidatura inteira. Por isso, conseguir uma bolsa lá fora pode ser
          mais acessível para quem não se dá bem em uma prova só.
        </p>
        <div className="compare-cols">
          <div className="panel">
            <h3>Prova única e longa</h3>
            <ul className="bullets">{SINGLE_EXAM.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
          <div className="panel">
            <h3>Processo holístico</h3>
            <ul className="bullets">{HOLISTIC.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        </div>
        <p className="small muted">{HOLISTIC_CAVEAT}</p>
        <p className="panel">{NEED_BLIND}</p>
      </section>

      <section aria-labelledby="sem-dinheiro">
        <h2 id="sem-dinheiro">Sem dinheiro</h2>
        <LinkList items={WITHOUT_MONEY} />
      </section>

      <section aria-labelledby="com-dinheiro">
        <h2 id="com-dinheiro">Com dinheiro</h2>
        <LinkList items={WITH_MONEY} />
      </section>

      <section aria-labelledby="realidade">
        <h2 id="realidade">O que é preciso de verdade</h2>
        <ul className="bullets">{REALITY.map((t) => <li key={t}>{t}</li>)}</ul>
      </section>

      <p className="hero-actions">
        <Link to="/caminho" className="btn btn-primary">Montar meu caminho</Link>
        <Link to="/editais" className="btn">Ver bolsas</Link>
      </p>
    </article>
  );
}
