// Nível de custo com três pontos e o texto por extenso (o texto é o que vale para leitor de tela).
import { COST_LABELS } from '../data/options';

export default function CostScale({ level }) {
  if (!COST_LABELS[level]) return null;
  return (
    <span className="cost">
      <span className="cost-dots" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span key={n} className={n <= level ? 'is-on' : ''} />
        ))}
      </span>
      {COST_LABELS[level]}
    </span>
  );
}
