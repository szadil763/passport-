# Roadmap do Carimbo

O MVP (v0.1) entrega login, perfil, o caminho com carimbos, destinos e recursos.

## Já entregue (v0.2 a v0.4, parcial)
- 14 países, 32 cidades (aba Lugares) e seção "Trabalhar em" em cada país.
- Objetivo "Trabalhar no exterior", etapas do caminho por objetivo, 39 recursos (testes de idioma, trabalho, bolsas).
- Calculadora de orçamento (a pessoa digita os valores; o app não sugere preços).
- Favoritos, "Esqueci minha senha" e PWA com cache offline.
- Acesso público sem login, página inicial, painel "próximo passo", busca e filtros, comparador de países e carimbo por país.
- Cursos online (22) e editais e bolsas (11), com lembrete no calendário (.ics).
- Painel admin (`/admin`) para editar países, cidades, cursos, editais e recursos, e página "Sobre e créditos".
- Falta: alerta por notificação ou e-mail (precisa de Cloud Functions e do plano Blaze).

O que segue abaixo ainda não foi feito.

As próximas versões estão em ordem de prioridade sugerida. Cada item traz a ideia e o primeiro passo técnico.

## v0.2: mais conteúdo e retenção
- **Mais países:** feito. Próximo: revisar os links oficiais a cada 3 meses.

## v0.3: app no celular
- **Alertas de editais:** avisar quando abrir um edital de bolsa de interesse. Primeiro passo: coleção `calls/{id}` com datas de abertura e fechamento e Firebase Cloud Messaging para notificações.

## v0.4: gestão de conteúdo
- **Simulador de custos:** estimar o custo do primeiro ano por destino e tipo de curso. A calculadora manual já existe. Próximo passo: faixas de custo revisadas por país (com fonte e data), sem valores inventados.

## v0.5: inteligência
- **Assistente com IA:** tirar dúvidas sobre o caminho com base no conteúdo curado do app. Primeiro passo: Cloud Function que consulta um modelo de linguagem só com os dados de `countries` e `resources`, sempre citando a fonte oficial.

## v0.6: comunidade
- **Relatos:** brasileiros contam como foi a experiência em cada país. Primeiro passo: coleção `stories/{id}` com moderação antes de publicar.
- **Troca de idiomas:** encontrar parceiros para praticar conversação. Primeiro passo: perfil público opcional e regras de privacidade claras.
- **Mentores:** conversar com quem já estuda fora. Primeiro passo: cadastro de mentores com verificação e agenda.

## v1.0: sustentabilidade
- **Monetização:** manter o app gratuito para o essencial. Opções: parcerias transparentes com escolas e cursos (sempre sinalizadas como parceria), plano premium com simulador avançado e mentorias, e doações. Primeiro passo: política pública de parcerias e selo "Parceiro" nos recursos.

## Sempre
- Revisar links e textos de visto a cada 3 meses e atualizar o `updatedAt` com o seed.
- Manter acessibilidade (contraste, foco, leitores de tela) em toda tela nova.
