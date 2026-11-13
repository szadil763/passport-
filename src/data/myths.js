// Textos da página "Mitos e verdades" e da chamada na página inicial.
// Regra: nada de promessa. Dizemos o que costuma acontecer, com ressalvas, e mandamos conferir nas fontes oficiais.

export const MYTHS = [
  {
    id: 'dinheiro',
    myth: 'Estudar fora é só para quem tem muito dinheiro.',
    truth:
      'Existem caminhos com pouco ou nenhum custo: bolsas integrais, universidades públicas sem mensalidade em alguns países, voluntariado e troca de trabalho por hospedagem, e cursos online gratuitos. Quem tem dinheiro ganha mais opções, mas ele não é a única porta.',
    links: [
      { to: '/editais', label: 'Ver bolsas' },
      { to: '/cursos', label: 'Ver cursos online' },
    ],
  },
  {
    id: 'bolsa',
    myth: 'É mais difícil conseguir uma bolsa lá fora do que uma vaga aqui.',
    truth:
      'Não necessariamente. Em muitas instituições estrangeiras a seleção é holística: olha o conjunto, e não uma prova única. Isso pode ser mais acessível para quem vai mal em prova longa, mas tem projetos, boas notas ao longo dos anos e uma história para contar. Continua competitivo, e o caminho é outro.',
    links: [{ to: '/mitos#holistico', label: 'Entender o processo holístico' }],
  },
  {
    id: 'prova',
    myth: 'Eu entendo a matéria, mas vou mal na prova, então não sirvo.',
    truth:
      'Uma prova mede um dia, e não mede tudo o que você sabe. Muitos processos no exterior olham o conjunto: notas ao longo dos anos, projetos, cartas de recomendação e a sua história. Isso não acaba com a competição, mas dá mais de um jeito de mostrar o que você sabe.',
    links: [
      { to: '/mitos#holistico', label: 'Entender o processo holístico' },
      { to: '/editais', label: 'Ver bolsas' },
    ],
  },
  {
    id: 'redacao',
    myth: 'Sou ruim em redação, então não consigo.',
    truth:
      'Muitos processos pedem um texto pessoal, mas ele é diferente de uma prova: você escreve com tempo, revisa, pede ajuda e conta a sua própria história. Muitas vezes é em inglês, o que exige treino. Os testes de idioma, como IELTS e TOEFL, têm uma parte de escrita com tempo marcado, e isso também se treina. Escrever melhora com prática, e há cursos e canais que ajudam.',
    links: [
      { to: '/cursos', label: 'Ver cursos de idioma' },
      { to: '/recursos', label: 'Ver testes de idioma' },
      { to: '/canais', label: 'Ver canais' },
    ],
  },
  {
    id: 'ingles',
    myth: 'Preciso falar inglês perfeito.',
    truth:
      'Você precisa do nível que a instituição pede, comprovado por um teste. E há opções em outros idiomas, como espanhol, francês, alemão, italiano e o português de Portugal. Dá para treinar de graça.',
    links: [{ to: '/cursos', label: 'Ver cursos de idioma' }],
  },
  {
    id: 'notas',
    myth: 'Só quem tem notas altíssimas consegue.',
    truth:
      'Notas contam, mas em processos holísticos também pesam suas atividades, seus projetos, o voluntariado e a sua trajetória. Há bolsas para perfis e áreas muito diferentes.',
    links: [{ to: '/editais', label: 'Ver bolsas por nível' }],
  },
  {
    id: 'tamanho',
    myth: 'Preciso ir já para a graduação completa.',
    truth:
      'Você escolhe o tamanho do passo: intercâmbio curto, graduação sanduíche, curso de idioma, summer job, voluntariado, mestrado ou doutorado.',
    links: [{ to: '/destinos', label: 'Ver destinos' }],
  },
  {
    id: 'comecar',
    myth: 'Só vale a pena começar quando eu souber tudo.',
    truth:
      'Ninguém sabe tudo no começo. O mais útil é começar cedo e dar um passo de cada vez: muitos prazos fecham quase um ano antes.',
    links: [{ to: '/caminho', label: 'Montar meu caminho' }],
  },
];

export const SINGLE_EXAM = [
  'Uma prova longa decide a vaga, às vezes ocupando o dia inteiro.',
  'Quem vai mal em um dia pode perder a vaga.',
  'Sobra pouco espaço para mostrar projetos, trabalho voluntário ou a sua história.',
  'A preparação gira em torno do conteúdo da prova.',
];

export const HOLISTIC = [
  'Avalia o conjunto: histórico escolar, redação, cartas de recomendação, atividades e projetos.',
  'Dá peso à sua história, ao que você já fez e ao que pretende fazer.',
  'Dá para se preparar ao longo dos anos, com coisas que você controla.',
  'Costuma exigir redação (muitas vezes em inglês) e cartas, que dão trabalho.',
  'Continua competitivo, principalmente nas universidades mais procuradas.',
];

export const HOLISTIC_CAVEAT =
  'Nem toda instituição é assim. Esse modelo é comum em universidades dos Estados Unidos. Em outros países, e em muitas bolsas, pesam mais as notas e os documentos. Confira o processo de cada uma.';

export const NEED_BLIND =
  'Algumas universidades dos Estados Unidos, como Harvard, MIT, Yale, Princeton e Amherst, avaliam estrangeiros sem considerar quanto a pessoa pode pagar e cobrem o valor comprovado da necessidade. A lista muda com o tempo: confira a página de ajuda financeira de cada uma.';

export const WITHOUT_MONEY = [
  { text: 'Bolsas integrais e parciais de governos, universidades e fundações.', to: '/editais', label: 'Bolsas' },
  { text: 'Universidades públicas sem mensalidade em alguns países, como a Alemanha.', to: '/destinos/alemanha', label: 'Alemanha' },
  { text: 'Voluntariado e troca de trabalho por hospedagem e comida.', to: '/recursos', label: 'Recursos' },
  { text: 'Cursos online gratuitos de universidades do exterior.', to: '/cursos', label: 'Cursos' },
  { text: 'Dicas de quem já foi, em canais do YouTube.', to: '/canais', label: 'Canais' },
];

export const WITH_MONEY = [
  { text: 'Curso de idioma no exterior, curto ou longo.', to: '/destinos', label: 'Destinos' },
  { text: 'Graduação, mestrado ou doutorado pagos, com opção de bolsa parcial.', to: '/editais', label: 'Bolsas' },
  { text: 'Planejar o custo antes de ir.', to: '/orcamento', label: 'Orçamento' },
];

export const REALITY = [
  'Dá trabalho: redação, documentos, tradução, testes de idioma e visto.',
  'Os prazos costumam fechar cerca de um ano antes. Comece cedo.',
  'Mesmo com bolsa, pode haver custos, como passagem, seguro e moradia. Confira o que cada bolsa cobre.',
  'Bolsas e vagas são disputadas. Não prometemos resultado, e sim um caminho.',
];
