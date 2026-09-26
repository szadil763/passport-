// Mensagens padrão para carregamento, erro e lista vazia.
export function Loading({ children = 'Carregando…' }) {
  return <p className="status" role="status">{children}</p>;
}

export function LoadError({ what }) {
  return (
    <p className="status error" role="alert">
      Não foi possível carregar {what}. Verifique sua conexão e recarregue a página.
    </p>
  );
}
