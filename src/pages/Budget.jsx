// Calculadora de orçamento. O app não sugere valores: a pessoa digita o que pesquisou.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { BUDGETS, labelOf } from '../data/options';
import {
  BUDGET_LIMITS,
  BUDGET_MONTHLY,
  BUDGET_ONCE,
  budgetTotals,
  formatBRL,
} from '../data/budget';

function MoneyField({ item, value, onChange }) {
  const hintId = `dica-${item.id}`;
  return (
    <div className="money-field">
      <label htmlFor={`v-${item.id}`}>{item.label}</label>
      <span id={hintId} className="hint">{item.hint}</span>
      <input
        id={`v-${item.id}`}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        placeholder="R$ 0,00"
        aria-describedby={hintId}
        value={value ?? ''}
        onChange={(e) => onChange(item.id, e.target.value)}
      />
    </div>
  );
}

export default function Budget() {
  usePageTitle('Orçamento');
  const { profile, saveProfile } = useAuth();
  const saved = profile?.budgetPlan ?? {};
  const [values, setValues] = useState(saved.values ?? {});
  const [months, setMonths] = useState(saved.months ?? '');
  const [status, setStatus] = useState('idle'); // idle | saving | saved | error

  const totals = budgetTotals(values, months);
  const limit = BUDGET_LIMITS[profile?.budget];

  const touch = (fn) => (...args) => {
    fn(...args);
    setStatus('idle');
  };
  const setValue = touch((id, v) => setValues((old) => ({ ...old, [id]: v })));
  const changeMonths = touch(setMonths);

  async function submit(event) {
    event.preventDefault();
    setStatus('saving');
    try {
      await saveProfile({ budgetPlan: { values, months: String(months) } });
      setStatus('saved');
    } catch {
      setStatus('error');
    }
  }

  let compare = null;
  if (profile?.budget === 'so-bolsa') {
    compare = 'Você escolheu "Só com bolsa". Use o total para saber quanto a bolsa precisa cobrir.';
  } else if (totals.total > 0 && limit) {
    compare =
      totals.total > limit
        ? `O total passa em ${formatBRL(totals.total - limit)} do limite da sua faixa (${labelOf(BUDGETS, profile.budget)}).`
        : `O total cabe na sua faixa (${labelOf(BUDGETS, profile.budget)}).`;
  }

  return (
    <form className="budget-form" onSubmit={submit}>
      <div>
        <Link to="/caminho" className="back">Voltar para Meu caminho</Link>
        <h1>Orçamento</h1>
        <p className="muted">
          Digite estimativas em reais. O app não sugere valores: pesquise nos sites da instituição e nos sites
          oficiais do governo.
        </p>
      </div>

      <fieldset className="budget-group">
        <legend>Gastos de uma vez</legend>
        {BUDGET_ONCE.map((item) => (
          <MoneyField key={item.id} item={item} value={values[item.id]} onChange={setValue} />
        ))}
      </fieldset>

      <fieldset className="budget-group">
        <legend>Gastos por mês</legend>
        {BUDGET_MONTHLY.map((item) => (
          <MoneyField key={item.id} item={item} value={values[item.id]} onChange={setValue} />
        ))}
        <div className="money-field">
          <label htmlFor="meses">Meses no exterior</label>
          <input
            id="meses"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="0"
            value={months}
            onChange={(e) => changeMonths(e.target.value)}
          />
        </div>
      </fieldset>

      <section className="panel budget-total" aria-live="polite" aria-labelledby="titulo-total">
        <h2 id="titulo-total">Total estimado</h2>
        <p className="big">{formatBRL(totals.total)}</p>
        <p className="small muted">
          {formatBRL(totals.once)} de uma vez + {formatBRL(totals.monthly)} por mês × {totals.months}{' '}
          {totals.months === 1 ? 'mês' : 'meses'}
        </p>
        {compare && <p>{compare}</p>}
      </section>

      <div className="stack" aria-live="polite">
        {status === 'saved' && <p className="saved">Orçamento salvo.</p>}
        {status === 'error' && (
          <p className="error" role="alert">Não foi possível salvar. Verifique sua conexão e tente de novo.</p>
        )}
        <button className="btn btn-primary" type="submit" disabled={status === 'saving'}>
          {status === 'saving' ? 'Salvando…' : 'Salvar orçamento'}
        </button>
      </div>
    </form>
  );
}
