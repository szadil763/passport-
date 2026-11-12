// Cartão de um país: carimbo, idiomas e custo. Usado em Destinos, na Home e nos favoritos.
import { Link } from 'react-router-dom';
import CountryStamp from './CountryStamp';
import CostScale from './CostScale';

export default function CountryCard({ country, match = false }) {
  return (
    <Link to={`/destinos/${country.id}`} className="country-card">
      <CountryStamp country={country} />
      <span className="country-card-body">
        <span className="country-name">{country.name}</span>
        <span className="country-meta">
          <span>{country.languages?.join(', ')}</span>
          <CostScale level={country.costLevel} />
        </span>
        {match && <span className="badge">Combina com você</span>}
      </span>
    </Link>
  );
}
