// Carimbo circular em SVG: marca visual de etapa concluída.
// As cores alternam entre verde e magenta, e cada carimbo tem uma rotação própria.
import { useId } from 'react';

export default function Stamp({ index, label = 'CARIMBADO', animate = false }) {
  const arcId = useId();
  const rotate = ((index * 47) % 21) - 12; // entre -12° e +8°, diferente em cada etapa
  const color = index % 2 === 0 ? 'green' : 'magenta';
  const ring = `${label} • ${label} • `;

  return (
    <svg
      className={`stamp stamp--${color}${animate ? ' is-new' : ''}`}
      viewBox="0 0 100 100"
      style={{ '--r': `${rotate}deg` }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <path id={arcId} d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
      </defs>
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="50" cy="50" r="27" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2.5" />
      <text fontSize="9.5" fontWeight="700" fill="currentColor" letterSpacing="1.2">
        <textPath href={`#${arcId}`}>{ring}</textPath>
      </text>
      <text x="50" y="59" textAnchor="middle" fontSize="26" fontWeight="800" fill="currentColor">
        {index + 1}
      </text>
    </svg>
  );
}
