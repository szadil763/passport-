// Muda o título da aba do navegador: ajuda quem usa leitor de tela e quem compartilha o link.
import { useEffect } from 'react';

const BASE = 'Carimbo: seu caminho para estudar e trabalhar fora';

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Carimbo` : BASE;
    return () => {
      document.title = BASE;
    };
  }, [title]);
}
