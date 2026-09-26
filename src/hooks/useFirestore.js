// Leitura simples do Firestore com estados de carregamento e erro.
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// Lê todos os documentos de uma coleção (countries ou resources).
export function useCollection(name) {
  const [state, setState] = useState({ data: [], loading: true, error: null });

  useEffect(() => {
    let active = true; // evita atualizar o estado depois que a tela fechou
    setState({ data: [], loading: true, error: null });
    getDocs(collection(db, name))
      .then((snap) => {
        if (active) setState({ data: snap.docs.map((d) => ({ id: d.id, ...d.data() })), loading: false, error: null });
      })
      .catch((error) => {
        if (active) setState({ data: [], loading: false, error });
      });
    return () => {
      active = false;
    };
  }, [name]);

  return state;
}

// Lê um documento pelo id.
export function useDocument(name, id) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let active = true;
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
