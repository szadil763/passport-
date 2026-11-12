// Formulário para criar ou editar um item. Os campos vêm de src/admin/schemas.js.
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { COLLECTIONS } from '../../admin/schemas';
import { docToForm, formToDoc, slugify, validateId } from '../../admin/forms';
import { useFreshCollection } from '../../admin/useFresh';
import { invalidateCollection } from '../../hooks/useFirestore';
import { usePageTitle } from '../../hooks/usePageTitle';
import ChipGroup from '../../components/ChipGroup';
import { LoadError, Loading } from '../../components/LoadState';

function Field({ field, value, onChange, error, options }) {
  const id = `f-${field.key.replace('.', '-')}`;
  const hintId = `${id}-dica`;
  const errId = `${id}-erro`;
  const describedBy = [field.hint && hintId, error && errId].filter(Boolean).join(' ') || undefined;

  let control;
  switch (field.type) {
    case 'textarea':
      control = <textarea id={id} rows={4} value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={describedBy} aria-invalid={Boolean(error)} />;
      break;
    case 'lines':
      control = <textarea id={id} rows={5} value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={describedBy} aria-invalid={Boolean(error)} />;
      break;
    case 'json':
      control = <textarea id={id} rows={7} className="mono" spellCheck={false} value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={describedBy} aria-invalid={Boolean(error)} />;
      break;
    case 'select':
      control = (
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={describedBy} aria-invalid={Boolean(error)}>
          {(field.allowEmpty || !value) && <option value="">{field.allowEmpty ? 'Nenhum' : 'Escolha…'}</option>}
          {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
      );
      break;
    case 'date':
      control = <input id={id} type="date" value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={describedBy} aria-invalid={Boolean(error)} />;
      break;
    case 'bool':
      return (
        <label className="checkbox">
          <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
          {field.label}
        </label>
      );
    case 'chips':
      return (
        <fieldset className="form-field">
          <legend id={`${id}-leg`}>{field.label}</legend>
          {field.hint && <p className="hint" id={hintId}>{field.hint}</p>}
          <ChipGroup options={options} value={value} onChange={onChange} multiple labelledBy={`${id}-leg`} />
          {error && <p className="error small" id={errId} role="alert">{error}</p>}
        </fieldset>
      );
    default:
      control = <input id={id} type={field.type === 'url' ? 'url' : 'text'} value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={describedBy} aria-invalid={Boolean(error)} />;
  }

  return (
    <div className="form-field">
      <label htmlFor={id}>{field.label}{field.required && <span aria-hidden="true"> *</span>}</label>
      {field.hint && <span className="hint" id={hintId}>{field.hint}</span>}
      {control}
      {error && <p className="error small" id={errId} role="alert">{error}</p>}
    </div>
  );
}

export default function AdminEdit() {
  const { collection: name, id: routeId } = useParams();
  const cfg = COLLECTIONS[name];
  const isNew = routeId === 'novo';
  const navigate = useNavigate();
  const items = useFreshCollection(cfg ? name : 'countries');
  const countries = useFreshCollection('countries');
  usePageTitle(cfg ? `Admin: ${isNew ? 'novo' : 'editar'} ${cfg.singular}` : 'Admin');

  const [form, setForm] = useState(null);
  const [newId, setNewId] = useState('');
  const [idTouched, setIdTouched] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | saving | error
  const [confirmDelete, setConfirmDelete] = useState(false);
  const summaryRef = useRef(null);

  const current = isNew ? null : items.data.find((d) => d.id === routeId) ?? null;

  // Preenche o formulário quando os dados chegam.
  useEffect(() => {
    if (!cfg || items.loading || countries.loading || form) return;
    if (isNew || current) setForm(docToForm(current, cfg.fields));
  }, [cfg, items.loading, countries.loading, isNew, current, form]);

  if (!cfg) {
    return (
      <div className="status">
        <h1>Tipo de conteúdo não encontrado</h1>
        <Link to="/admin">Voltar ao painel</Link>
      </div>
    );
  }
  if (items.loading || countries.loading) return <Loading />;
  if (items.error || countries.error) return <LoadError what="os dados" />;
  if (!isNew && !current) {
    return (
      <div className="status">
        <h1>Item não encontrado</h1>
        <Link to={`/admin/${name}`}>Voltar à lista</Link>
      </div>
    );
  }
  if (!form) return <Loading />;

  const countryOptions = [...countries.data]
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
    .map((c) => ({ id: c.id, label: `${c.flag} ${c.name}` }));
  const optionsFor = (f) => (f.source === 'countries' ? countryOptions : f.options ?? []);

  const setField = (key, value) => {
    setForm((old) => ({ ...old, [key]: value }));
    setErrors((old) => ({ ...old, [key]: undefined }));
    setStatus('idle');
  };

  async function submit(event) {
    event.preventDefault();
    const { data, errors: found } = formToDoc(form, cfg.fields);
    const docId = isNew ? newId || slugify(form[cfg.slugFrom]) : routeId;

    if (isNew) {
      const idError = validateId(docId, items.data.map((d) => d.id));
      if (idError) found.__id = idError;
    }
    setErrors(found);
    if (Object.keys(found).length) {
      setTimeout(() => summaryRef.current?.focus(), 0);
      return;
    }

    // Campos que o formulário não conhece continuam como estavam.
    const known = new Set(cfg.fields.map((f) => f.key.split('.')[0]));
    const kept = current
      ? Object.fromEntries(Object.entries(current).filter(([k]) => !known.has(k) && k !== 'id' && k !== 'updatedAt'))
      : {};

    setStatus('saving');
    try {
      await setDoc(doc(db, name, docId), { ...kept, ...data, updatedAt: serverTimestamp() });
      invalidateCollection(name);
      navigate(`/admin/${name}`, { state: { saved: `${form[cfg.titleKey] ?? docId} foi salvo.` } });
    } catch {
      setStatus('error');
    }
  }

  async function remove() {
    setStatus('saving');
    try {
      await deleteDoc(doc(db, name, routeId));
      invalidateCollection(name);
      navigate(`/admin/${name}`, { state: { saved: `${current[cfg.titleKey] ?? routeId} foi excluído.` } });
    } catch {
      setStatus('error');
    }
  }

  const errorList = Object.entries(errors).filter(([, v]) => v);

  return (
    <form className="stack admin-form" onSubmit={submit} noValidate>
      <Link to={`/admin/${name}`} className="back">Voltar à lista</Link>
      <h1>{isNew ? `Adicionar ${cfg.singular}` : `Editar ${cfg.singular}`}</h1>

      {errorList.length > 0 && (
        <div className="panel error-summary" role="alert" tabIndex={-1} ref={summaryRef}>
          <strong>Corrija {errorList.length === 1 ? 'este ponto' : 'estes pontos'} para salvar:</strong>
          <ul className="bullets">
            {errorList.map(([k, v]) => <li key={k}>{v}</li>)}
          </ul>
        </div>
      )}

      {isNew && (
        <div className="form-field">
          <label htmlFor="f-id">Identificador</label>
          <span className="hint" id="f-id-dica">Vira parte do endereço e não muda depois. Só letras minúsculas, números e hífen.</span>
          <input
            id="f-id"
            type="text"
            value={idTouched ? newId : newId || slugify(form[cfg.slugFrom])}
            onChange={(e) => { setIdTouched(true); setNewId(e.target.value); setErrors((o) => ({ ...o, __id: undefined })); }}
            aria-describedby="f-id-dica"
          />
        </div>
      )}

      {cfg.fields.map((f) => (
        <Field
          key={f.key}
          field={f}
          value={form[f.key]}
          onChange={(v) => setField(f.key, v)}
          error={errors[f.key]}
          options={optionsFor(f)}
        />
      ))}

      <div className="stack" aria-live="polite">
        {status === 'error' && (
          <p className="error" role="alert">
            Não foi possível salvar. Verifique sua conexão e se você ainda é administrador, e tente de novo.
          </p>
        )}
        <button className="btn btn-primary" type="submit" disabled={status === 'saving'}>
          {status === 'saving' ? 'Salvando…' : isNew ? `Adicionar ${cfg.singular}` : 'Salvar alterações'}
        </button>
      </div>

      {!isNew && (
        <div className="panel danger-zone">
          {!confirmDelete ? (
            <button type="button" className="btn" onClick={() => setConfirmDelete(true)}>Excluir {cfg.singular}</button>
          ) : (
            <div className="stack">
              <p><strong>Excluir "{current[cfg.titleKey] ?? routeId}"?</strong> Isso não pode ser desfeito.</p>
              <div className="card-actions">
                <button type="button" className="btn btn-danger" onClick={remove} disabled={status === 'saving'}>Sim, excluir</button>
                <button type="button" className="btn" onClick={() => setConfirmDelete(false)}>Cancelar</button>
              </div>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
