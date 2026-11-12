// Leitura simples do Firestore com cache em memória e estados de carregamento e erro.
// O cache evita buscar de novo a cada troca de tela: mostra o que já temos e atualiza em segundo plano.
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const FRESH_MS = 60_000;
const collections = new Map(); // nome -> { data, at }
const inflight = new Map(); // nome -> Promise

function fetchCollection(name) {
  if (!inflight.has(name)) {
    const promise = getDocs(collection(db, name))
      .then((snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        collections.set(name, { data, at: Date.now() });
        return data;
      })
      .finally(() => inflight.delete(name));
    inflight.set(name, promise);
  }
  return inflight.get(name);
}

// Esquece o cache de uma coleção (o painel admin chama depois de salvar ou excluir).
export function invalidateCollection(name) {
  collections.delete(name);
}

// Lê todos os documentos de uma coleção (countries, places, courses, calls ou resources).
export function useCollection(name) {
  const cached = collections.get(name);
  const [state, setState] = useState(
    cached ? { data: cached.data, loading: false, error: null } : { data: [], loading: true, error: null }
  );

  useEffect(() => {
    let active = true; // evita atualizar o estado depois que a tela fechou
    const hit = collections.get(name);
    if (hit) {
      setState({ data: hit.data, loading: false, error: null });
      if (Date.now() - hit.at < FRESH_MS) return () => { active = false; };
    } else {
      setState({ data: [], loading: true, error: null });
    }
    fetchCollection(name)
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((error) => {
        // Se já havia dados guardados, continua mostrando eles.
        if (active && !collections.has(name)) setState({ data: [], loading: false, error });
      });
    return () => {
      active = false;
    };
  }, [name]);

  return state;
}

// Lê um documento pelo id. Se a coleção já está no cache, usa o que há nela.
export function useDocument(name, id) {
  const fromCache = collections.get(name)?.data.find((d) => d.id === id) ?? null;
  const [state, setState] = useState(
    fromCache ? { data: fromCache, loading: false, error: null } : { data: null, loading: true, error: null }
  );

  useEffect(() => {
    let active = true;
    const hit = collections.get(name)?.data.find((d) => d.id === id);
    if (hit) {
      setState({ data: hit, loading: false, error: null });
      return () => { active = false; };
    }
    setState({ data: null, loading: true, error: null });
    getDoc(doc(db, name, id))
      .then((snap) => {
        if (active) setState({ data: snap.exists() ? { id: snap.id, ...snap.data() } : null, loading: false, error: null });
      })
      .catch((error) => {
        if (active) setState({ data: null, loading: false, error });
      });
    return () => {
      active = false;
    };
  }, [name, id]);

  return state;
}
