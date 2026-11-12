// Navegação entre as três telas de estudo: Cursos online, Editais e Recursos.
import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/cursos', label: 'Cursos online' },
  { to: '/editais', label: 'Editais e bolsas' },
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
