// Usada em dois lugares: no primeiro acesso (onboarding) e na aba Perfil.
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GOALS, LANGUAGES, BUDGETS } from '../data/options';
import ChipGroup from '../components/ChipGroup';

export default function Profile({ onboarding = false }) {
  const { user, profile, saveProfile } = useAuth();
  const [goal, setGoal] = useState(profile?.goal ?? '');
  const [languages, setLanguages] = useState(profile?.languages ?? []);
  const [budget, setBudget] = useState(profile?.budget ?? '');
  const [status, setStatus] = useState('idle'); // idle | saving | saved | error

  const missing = [!goal && 'objetivo', !languages.length && 'idioma', !budget && 'orçamento'].filter(Boolean);

  async function submit(event) {
    event.preventDefault();
    if (missing.length) return;
    setStatus('saving');
    try {
      await saveProfile({ goal, languages, budget, roadmap: profile?.roadmap ?? {} });
      setStatus('saved');
    } catch {
      setStatus('error');
    }
  }

  // Qualquer mudança apaga a mensagem "Perfil salvo".
  const edit = (setter) => (v) => {
    setter(v);
    if (status !== 'saving') setStatus('idle');
  };

  const content = (
    <form className="profile-form" onSubmit={submit}>
      <div>
        <h1>{onboarding ? 'Vamos montar seu caminho' : 'Seu perfil'}</h1>
        <p className="muted">
          Suas respostas decidem quais destinos aparecem primeiro. Você pode mudar tudo depois na aba Perfil.
        </p>
        {!onboarding && user?.email && <p className="small muted">Conta: {user.email}</p>}
      </div>

      <fieldset>
        <legend id="leg-objetivo">O que você quer fazer fora do Brasil?</legend>
        <p className="hint">Escolha uma opção.</p>
        <ChipGroup options={GOALS} value={goal} onChange={edit(setGoal)} labelledBy="leg-objetivo" />
      </fieldset>

      <fieldset>
        <legend id="leg-idiomas">Quais idiomas te interessam?</legend>
        <p className="hint">Escolha quantos quiser.</p>
        <ChipGroup options={LANGUAGES} value={languages} onChange={edit(setLanguages)} multiple labelledBy="leg-idiomas" />
      </fieldset>

      <fieldset>
        <legend id="leg-orcamento">Quanto você pretende investir?</legend>
        <p className="hint">Um valor aproximado para o primeiro ano.</p>
        <ChipGroup options={BUDGETS} value={budget} onChange={edit(setBudget)} labelledBy="leg-orcamento" />
      </fieldset>

      <div className="stack" aria-live="polite">
        {missing.length > 0 && <p className="hint">Falta escolher: {missing.join(', ')}.</p>}
        {status === 'saved' && !onboarding && <p className="saved">Perfil salvo.</p>}
        {status === 'error' && (
          <p className="error" role="alert">Não foi possível salvar. Verifique sua conexão e tente de novo.</p>
        )}
        <button className="btn btn-primary" type="submit" disabled={missing.length > 0 || status === 'saving'}>
          {status === 'saving' ? 'Salvando…' : onboarding ? 'Começar meu caminho' : 'Salvar perfil'}
        </button>
      </div>
    </form>
  );

  return onboarding ? <main className="onboarding">{content}</main> : content;
}
