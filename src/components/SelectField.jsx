// Lista de escolha nativa (boa no celular), com rótulo visível.
import { useId } from 'react';

export default function SelectField({ label, value, onChange, options }) {
  const id = useId();
  return (
    <div className="select-field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
