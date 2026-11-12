// Cartão de uma cidade, usado na lista de Lugares e na página do país.
import { Link } from 'react-router-dom';

export default function PlaceRow({ place, country }) {
  return (
    <Link to={`/lugares/${place.id}`} className="place-row">
      <span className="place-name">{place.name}</span>
      {country && <span className="place-where">{country.flag} {country.name}</span>}
      <p>{place.summary}</p>
      {place.costNote && <p className="small muted">{place.costNote}</p>}
    </Link>
  );
}
