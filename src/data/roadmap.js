// As etapas do caminho até a chegada, em ordem.
// "goals" (opcional): a etapa só aparece para quem escolheu um desses objetivos.
// "to" e "linkLabel" (opcionais): atalho para uma ferramenta do app.
// O "id" é a chave gravada em users/{uid}.roadmap: não mude um id existente.
export const ROADMAP_STEPS = [
  {
    id: 'destino',
    title: 'Escolher o destino',
    hint: 'Compare idioma, custo e regras de visto na aba Destinos.',
    to: '/destinos',
    linkLabel: 'Ver destinos',
  },
  {
    id: 'orcamento',
    title: 'Montar o orçamento',
    hint: 'Some curso, moradia, seguro, passagem e uma reserva para imprevistos.',
    to: '/orcamento',
    linkLabel: 'Abrir a calculadora de orçamento',
  },
  {
    id: 'proficiencia',
    title: 'Fazer o teste de proficiência',
    hint: 'Veja qual teste a instituição aceita antes de marcar a prova.',
    to: '/cursos',
    linkLabel: 'Ver cursos de idioma online',
  },
  {
    id: 'curriculo',
    title: 'Preparar o currículo',
    hint: 'Adapte o currículo ao formato do país e revise o perfil profissional em inglês.',
    goals: ['trabalho', 'voluntariado', 'intercambio'],
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
    to: '/editais',
    linkLabel: 'Ver editais e bolsas',
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
    id: 'moradia',
    title: 'Reservar a moradia das primeiras semanas',
    hint: 'Prefira reserva confirmada por escrito. Desconfie de quem pede pagamento antecipado fora de plataformas conhecidas.',
  },
  {
    id: 'embarque',
    title: 'Comprar a passagem e embarcar',
    hint: 'Confirme seguro-viagem e moradia das primeiras semanas antes de viajar.',
  },
  {
    id: 'chegada',
    title: 'Fazer os registros da chegada',
    hint: 'Veja no site oficial o que registrar nas primeiras semanas, como endereço, documento de residência e conta bancária.',
  },
];

// Etapas que valem para o objetivo escolhido.
export const stepsFor = (goal) => ROADMAP_STEPS.filter((s) => !s.goals || s.goals.includes(goal));
