// Mensagens padrão para carregamento, erro e lista vazia.
// O carregamento mostra blocos cinza no lugar do conteúdo, para a tela não "pular".
export function Loading({ children = 'Carregando…', blocks = 3 }) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{children}</span>
      <div className="skeleton-list" aria-hidden="true">
        {Array.from({ length: blocks }, (_, i) => (
          <div key={i} className="skeleton" />
        ))}
      </div>
    </div>
  );
}

export function LoadError({ what }) {
  return (
    <p className="status error" role="alert">
      Não foi possível carregar {what}. Verifique sua conexão e recarregue a página.
    </p>
  );
}
