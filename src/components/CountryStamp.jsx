// Carimbo de imigração de um país: o nome corre pela borda e a bandeira fica no centro.
// A cor (verde ou magenta) e a inclinação vêm do id, então cada país tem sempre o mesmo carimbo.
import { useId } from 'react';

export function stampSeed(id = '') {
  return [...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
}

export default function CountryStamp({ country, size = 'md' }) {
  const arcId = useId();
  const seed = stampSeed(country.id);
  const color = seed % 2 === 0 ? 'green' : 'magenta';
  const rotate = (seed % 17) - 9; // entre -9° e +7°
  const name = country.name.toUpperCase();
  const ring = `${name} • ${name} • `;

  return (
    <svg
      className={`country-stamp country-stamp--${color} country-stamp--${size}`}
      viewBox="0 0 100 100"
      style={{ '--r': `${rotate}deg` }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <path id={arcId} d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
      </defs>
      <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="3.5" />
      <circle cx="50" cy="50" r="26" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2.5" />
      <text fontSize="8.5" fontWeight="700" fill="currentColor" letterSpacing="1">
        <textPath href={`#${arcId}`}>{ring}</textPath>
      </text>
      <text x="50" y="62" textAnchor="middle" fontSize="30">{country.flag}</text>
    </svg>
  );
}
