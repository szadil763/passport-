// Tela inicial: as 8 etapas até o embarque. Cada etapa concluída ganha um carimbo.
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ROADMAP_STEPS } from '../data/roadmap';
import Stamp from '../components/Stamp';

export default function Roadmap() {
  const { profile, saveProfile } = useAuth();
  const [justStamped, setJustStamped] = useState(null); // anima só o carimbo recém-marcado
  const [error, setError] = useState('');

  const done = profile?.roadmap ?? {};
  const total = ROADMAP_STEPS.length;
  const count = ROADMAP_STEPS.filter((s) => done[s.id]).length;

  async function toggle(id) {
    const next = !done[id];
    setError('');
    setJustStamped(next ? id : null);
    try {
      await saveProfile({ roadmap: { ...done, [id]: next } });
    } catch {
      setError('Não foi possível salvar a etapa. Verifique sua conexão e tente de novo.');
    }
  }

  let message = 'Toque numa etapa quando terminar. Ela ganha um carimbo no seu passaporte.';
  if (count === total) message = 'Passaporte completo. Boa viagem!';
  else if (count > 0) message = 'Continue: cada etapa concluída te deixa mais perto do embarque.';

  return (
    <section>
      <h1>Meu caminho</h1>

      <div className="progress">
        <p className="progress-label" aria-live="polite">{count} de {total} carimbos</p>
        <div className="progress-bar" aria-hidden="true">
          <span style={{ width: `${(count / total) * 100}%` }} />
        </div>
      </div>
      <p className="muted">{message}</p>
      {error && <p className="error" role="alert">{error}</p>}

      <ol className="passport">
        {ROADMAP_STEPS.map((step, i) => {
          const isDone = Boolean(done[step.id]);
          return (
            <li key={step.id} className={`visa-page${isDone ? ' is-done' : ''}`}>
              <button
                type="button"
                className="visa-toggle"
                aria-pressed={isDone}
                onClick={() => toggle(step.id)}
              >
                <span className="visa-text">
                  <span className="visa-step">Etapa {i + 1}</span>
                  <span className="visa-title">{step.title}</span>
                  <span className="visa-hint">{step.hint}</span>
                </span>
                {isDone ? (
                  <Stamp index={i} animate={justStamped === step.id} />
                ) : (
                  <span className="stamp-slot" aria-hidden="true">{i + 1}</span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
