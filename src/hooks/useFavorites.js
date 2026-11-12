// Favoritos do usuário em users/{uid}.favorites = { countries, places, resources, courses, calls }, listas de ids.
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const FAVORITE_KINDS = ['countries', 'places', 'resources', 'courses', 'calls'];

export function useFavorites() {
  const { profile, saveProfile } = useAuth();
  const [error, setError] = useState('');
  const favorites = profile?.favorites ?? {};

  const has = (kind, id) => (favorites[kind] ?? []).includes(id);

  async function toggle(kind, id) {
    setError('');
    const current = Object.fromEntries(FAVORITE_KINDS.map((k) => [k, favorites[k] ?? []]));
    current[kind] = has(kind, id) ? current[kind].filter((x) => x !== id) : [...current[kind], id];
    try {
      await saveProfile({ favorites: current });
    } catch {
      setError('Não foi possível salvar o favorito. Verifique sua conexão e tente de novo.');
    }
  }

  return { has, toggle, error, favorites };
}
