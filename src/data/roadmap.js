// As 8 etapas do caminho até o embarque, em ordem.
// O "id" é a chave gravada em users/{uid}.roadmap: não mude um id existente.
export const ROADMAP_STEPS = [
  {
    id: 'destino',
    title: 'Escolher o destino',
    hint: 'Compare idioma, custo e regras de visto na aba Destinos.',
  },
  {
    id: 'orcamento',
    title: 'Montar o orçamento',
    hint: 'Some curso, moradia, seguro, passagem e uma reserva para imprevistos.',
  },
  {
    id: 'proficiencia',
    title: 'Fazer o teste de proficiência',
    hint: 'Veja qual teste a instituição aceita antes de marcar a prova.',
  },
  {
    id: 'documentos',
    title: 'Reunir os documentos',
    hint: 'Passaporte válido, histórico escolar, diploma e traduções, se pedirem.',
  },
  {
    id: 'candidatura',
    title: 'Enviar a candidatura',
    hint: 'Prepare carta de motivação, currículo e cartas de recomendação com antecedência.',
  },
  {
    id: 'aceite',
    title: 'Receber a carta de aceite',
    hint: 'Guarde uma cópia em PDF: o pedido de visto costuma exigir esse documento.',
  },
  {
    id: 'visto',
    title: 'Pedir o visto',
    hint: 'Siga a lista de documentos do site oficial do governo do país.',
  },
  {
    id: 'embarque',
    title: 'Comprar a passagem e embarcar',
    hint: 'Confirme seguro-viagem e moradia das primeiras semanas antes de viajar.',
  },
];
