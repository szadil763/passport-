// Cursos online do exterior: de universidades, de idiomas e de graduação ou pós a distância.
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCollection } from '../hooks/useFirestore';
import { usePageTitle } from '../hooks/usePageTitle';
import { CERTIFICATES, COURSE_KINDS, LANGUAGES, PRICE_TYPES, labelOf } from '../data/options';
import { matchesQuery } from '../utils/text';
import ChipGroup from '../components/ChipGroup';
import FavoriteButton from '../components/FavoriteButton';
import { LoadError, Loading } from '../components/LoadState';
import SearchField from '../components/SearchField';
import SelectField from '../components/SelectField';
import StudyNav from '../components/StudyNav';

const KIND_FILTERS = [{ id: 'todos', label: 'Todos os tipos' }, ...COURSE_KINDS];
const PRICE_FILTERS = [{ id: 'todos', label: 'Qualquer preço' }, ...PRICE_TYPES];

export default function Courses() {
  usePageTitle('Cursos online');
  const { profile } = useAuth();
  const courses = useCollection('courses');
  const countries = useCollection('countries');
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('todos');
  const [price, setPrice] = useState('todos');
  const [language, setLanguage] = useState('todos');

  if (courses.loading || countries.loading) return <Loading>Carregando cursos…</Loading>;
  if (courses.error || countries.error) return <LoadError what="os cursos" />;

  const byId = Object.fromEntries(countries.data.map((c) => [c.id, c]));
  const mine = profile?.languages ?? [];
  const languageOptions = [{ id: 'todos', label: 'Qualquer idioma' }, ...LANGUAGES];

  const list = courses.data
    .filter((c) => matchesQuery(query, c.title, c.provider, c.description, c.languages, byId[c.country]?.name))
    .filter((c) => kind === 'todos' || c.kind === kind)
    .filter((c) => price === 'todos' || c.priceType === price)
    .filter((c) => language === 'todos' || c.languages?.includes(language))
    // Cursos nos idiomas do perfil primeiro.
    .sort((a, b) => {
      const score = (c) => (c.languages ?? []).filter((l) => mine.includes(l)).length;
      return score(b) - score(a) || a.title.localeCompare(b.title, 'pt-BR');
    });

  const showDiplomaNotice = list.some((c) => c.kind === 'diploma');

  return (
    <section>
      <h1>Cursos online</h1>
      <StudyNav />
      <p className="muted">
        Estude com universidades e escolas do exterior sem sair de casa. Ajuda no idioma, no currículo e na
        candidatura.
      </p>

      <div className="filters">
        <SearchField label="Buscar curso" value={query} onChange={setQuery} placeholder="Ex.: inglês, MIT, Portugal" />
        <p id="rotulo-tipo" className="sr-only">Filtrar por tipo</p>
        <ChipGroup options={KIND_FILTERS} value={kind} onChange={setKind} labelledBy="rotulo-tipo" />
        <p id="rotulo-preco" className="sr-only">Filtrar por preço</p>
        <ChipGroup options={PRICE_FILTERS} value={price} onChange={setPrice} labelledBy="rotulo-preco" />
        <SelectField label="Idioma do curso" value={language} onChange={setLanguage} options={languageOptions} />
      </div>

      <p className="small muted" aria-live="polite">
        {list.length === 1 ? '1 curso encontrado' : `${list.length} cursos encontrados`}
      </p>

      {showDiplomaNotice && (
        <p className="panel notice-soft">
          <strong>Antes de pagar por um diploma online:</strong> confirme se a instituição é reconhecida no país
          dela e se o diploma vale no Brasil. Diplomas estrangeiros podem precisar de revalidação. Veja as regras
          no <a href="https://www.gov.br/mec" target="_blank" rel="noopener noreferrer">site do MEC<span className="sr-only"> (abre em nova aba)</span></a>.
        </p>
      )}

      {list.length === 0 ? (
        <p className="status">Nenhum curso com esses filtros. Mude a busca ou escolha outro tipo.</p>
      ) : (
        <ul className="resource-list">
          {list.map((c) => {
            const country = byId[c.country];
            return (
              <li key={c.id}>
                <a href={c.officialUrl} target="_blank" rel="noopener noreferrer">
                  {c.title}<span className="sr-only"> (abre em nova aba)</span>
                </a>
                <span className="place-where">
                  {c.provider}{country ? ` · ${country.flag} ${country.name}` : ''}
                </span>
                <span className="resource-meta">
                  <span className="pill">{labelOf(COURSE_KINDS, c.kind)}</span>
                  <span className={`pill${c.priceType === 'gratuito' ? ' pill--free' : ''}`}>{labelOf(PRICE_TYPES, c.priceType)}</span>
                  <span className="pill">{CERTIFICATES[c.certificate] ?? c.certificate}</span>
                  {c.languages?.length > 0 && <span className="pill">{c.languages.join(', ')}</span>}
                </span>
                <p>{c.description}</p>
                <FavoriteButton kind="courses" id={c.id} name={c.title} />
              </li>
            );
          })}
        </ul>
      )}
      <p className="small muted">Preços e certificados mudam. Confirme no site do curso antes de se inscrever.</p>
    </section>
  );
}
