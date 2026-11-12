// Navegação entre as telas de estudo: Cursos online, Editais e bolsas, Canais e Recursos.
import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/cursos', label: 'Cursos' },
  { to: '/editais', label: 'Bolsas' },
  { to: '/canais', label: 'Canais' },
  { to: '/recursos', label: 'Recursos' },
];

export default function StudyNav() {
  return (
    <nav className="study-nav" aria-label="Estudar">
      {LINKS.map((l) => (
        <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
      ))}
    </nav>
  );
}
