// Campo de busca com rótulo visível.
import { useId } from 'react';
import { IconSearch } from './Icons';

export default function SearchField({ label = 'Buscar', value, onChange, placeholder }) {
  const id = useId();
  return (
    <div className="search">
      <label htmlFor={id}>{label}</label>
      <div className="search-box">
        <IconSearch />
        <input
          id={id}
          type="search"
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
