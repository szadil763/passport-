// Leitura sem cache para o painel admin: quem edita precisa ver sempre o que está de fato no banco.
import { useCallback, useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export function useFreshCollection(name) {
  const [state, setState] = useState({ data: [], loading: true, error: null });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let active = true;
    setState((old) => ({ ...old, loading: true, error: null }));
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
  }, [name, tick]);

  const reload = useCallback(() => setTick((n) => n + 1), []);
  return { ...state, reload };
}
