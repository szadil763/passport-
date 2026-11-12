// Compartilha o link da página: abre o menu do celular ou, se não houver, copia o endereço.
import { useState } from 'react';
import { IconShare } from './Icons';

export default function ShareButton({ title, text }) {
  const [message, setMessage] = useState('');

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setMessage('Link copiado.');
    } catch (error) {
      if (error?.name === 'AbortError') return; // a pessoa fechou o menu
      setMessage('Não foi possível copiar. Copie o endereço na barra do navegador.');
    }
    setTimeout(() => setMessage(''), 4000);
  }

  return (
    <>
      <button type="button" className="fav" onClick={share}>
        <IconShare />
        <span>Compartilhar<span className="sr-only"> {title}</span></span>
      </button>
      <span className="small muted" role="status">{message}</span>
    </>
  );
}
