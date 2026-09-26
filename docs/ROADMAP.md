# Roadmap do Carimbo

O MVP (v0.1) entrega login, perfil, o caminho com carimbos, destinos e recursos.
As próximas versões estão em ordem de prioridade sugerida. Cada item traz a ideia e o primeiro passo técnico.

## v0.2: mais conteúdo e retenção
- **Mais países:** Espanha, França, Itália, Reino Unido, Estados Unidos, Austrália, Nova Zelândia, Chile, Argentina e Japão. Primeiro passo: ampliar `seed/countries.json` e revisar os links oficiais.
- **Favoritos:** salvar países e recursos. Primeiro passo: campo `favorites{countries[], resources[]}` em `users/{uid}` e atualizar `validProfile()` nas regras.
- **Esqueci minha senha:** link na tela de login com `sendPasswordResetEmail`.

## v0.3: app no celular
- **PWA:** instalar na tela inicial e abrir sem internet para o que já foi visto. Primeiro passo: `vite-plugin-pwa` com manifesto e cache do conteúdo curado.
- **Alertas de editais:** avisar quando abrir um edital de bolsa de interesse. Primeiro passo: coleção `calls/{id}` com datas de abertura e fechamento e Firebase Cloud Messaging para notificações.

## v0.4: gestão de conteúdo
- **Painel admin:** editar países e recursos sem mexer no JSON. Primeiro passo: custom claim `admin` no Auth e regras que liberam escrita só para admins.
- **Simulador de custos:** estimar o custo do primeiro ano por destino e tipo de curso. Primeiro passo: faixas de custo revisadas por país (com fonte e data), sem valores inventados.

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
