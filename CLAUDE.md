# CLAUDE.md: contexto do projeto Carimbo

## O que é
App web, pensado primeiro para celular, que ajuda brasileiros a aprender idiomas, fazer intercâmbio e estudar fora do Brasil.
Toda a interface, os comentários de código e a documentação são em **português do Brasil**.

## Stack
- React 18 + Vite 5, JavaScript (sem TypeScript), react-router-dom 6
- Firebase v10 modular: Authentication (Google + e-mail/senha), Firestore, Hosting
- CSS puro em `src/styles.css`, com tokens em `:root` e tema escuro via `prefers-color-scheme`
- Deploy: GitHub Actions (`.github/workflows/deploy.yml`) com `FirebaseExtended/action-hosting-deploy`

## Comandos
- `npm install`: instala as dependências
- `npm run dev`: servidor local em http://localhost:5173
- `npm run build`: build de produção em `dist/`. **Rode ao final de toda mudança.**
- `npm test`: testes das funções puras (`tests/*.test.mjs`, sem dependências)
- `npm run preview`: serve o build localmente
- `npm run emulators`: emuladores de Auth e Firestore (projeto `demo-carimbo`; precisa do Firebase CLI e de Java)
- `npm run seed:emulador`: envia `seed/*.json` para o emulador
- `npm run seed`: envia `seed/*.json` para o Firestore de produção (usa `serviceAccount.json` ou `GOOGLE_APPLICATION_CREDENTIALS`). Com `-- --somente-novos`, só grava o que ainda não existe
- `npm run deploy`: build + deploy manual de Hosting e regras do Firestore

Para usar os emuladores no app, coloque `VITE_USE_EMULATORS=true` no `.env`.

## Estrutura
- `src/firebase.js`: inicialização do Firebase (lê o `.env`)
- `src/contexts/AuthContext.jsx`: usuário logado + perfil `users/{uid}` em tempo real, `saveProfile()` com merge
- `src/hooks/useFirestore.js`: `useCollection` e `useDocument` com cache em memória, loading e erro; `useFavorites.js`: favoritos em `users/{uid}.favorites`; `usePageTitle.js`: título da aba
- `src/data/`: opções fixas (`options.js`), etapas do caminho (`roadmap.js`), itens e contas do orçamento (`budget.js`), mensagens de erro do Auth (`authErrors.js`)
- `src/admin/`: painel admin. `schemas.js` (campos de cada coleção), `forms.js` (conversão e validação, testada), `useFresh.js` (leitura sem cache). Para um campo novo em uma coleção, acrescente-o em `schemas.js`.
- `src/utils/`: `text.js` (busca sem acento), `dates.js` (prazos de editais), `ics.js` (lembrete de calendário), `analytics.js` e `track.js` (contador de acessos)
- `public/`: `manifest.webmanifest`, ícones e `sw.js` (PWA: app abre sem internet)
- `src/components/`: `Layout`, `Stamp` (carimbo SVG), `ChipGroup`, `VisaNotice`, `LoadState`, `Icons`, `PlaceRow`, `FavoriteButton`, `CountryCard`, `CountryStamp`, `CostScale`, `SearchField`, `SelectField`, `ShareButton`, `StudyNav`
- `src/pages/`: `Login`, `Profile` (onboarding e aba Perfil), `Roadmap`, `Destinations`, `Country`, `Home` (landing pública e painel), `Compare`, `Places`, `Place`, `Courses`, `Calls`, `Channels`, `Resources`, `Favorites`, `Budget`, `About` (créditos), `admin/` (`AdminHome`, `AdminList`, `AdminEdit`)
- `seed/`: conteúdo curado (`countries`, `places`, `courses`, `calls`, `channels`, `resources`); `scripts/seed.mjs`: envia o seed com firebase-admin

## Modelo de dados (Firestore)
- `countries/{id}`: name, flag, languages[], summary, costLevel (1-3), visa{name, work, officialUrl}, work{students, programs[{name, description, url?}], jobSites[{title, url}]}, highlights[], updatedAt
- `places/{id}`: countryId, name, summary, costNote (texto relativo, sem valores), goals[], study[], work[], living[], universities[{name, url}], updatedAt
- `courses/{id}`: title, provider, kind (universidade|idioma|diploma), country?, languages[], priceType (gratuito|misto|pago), certificate (pago|gratuito|varia|nenhum), officialUrl, description, updatedAt
- `calls/{id}`: title, organization, countries[], levels[], officialUrl, description, opensAt?, closesAt? ("AAAA-MM-DD"), datesNote, updatedAt
- `channels/{id}`: name, url (canal do YouTube), kind (criador|instituicao|agencia), topics[] (bolsas|intercambio|trabalho|voluntariado|vida), countries[] (vazio = fala de vários países), description, note?, updatedAt
- `resources/{id}`: title, url, category, free, countries[], description, updatedAt
- `admins/{uid}`: qualquer campo (ex.: `ativo: true`). Só o console do Firebase cria. Quem tem o documento é administrador (`isAdmin()` em `firestore.rules`) e escreve no conteúdo curado.
- `stats/{AAAA-MM-DD}`: views, visitors e um contador por seção (`s_inicio`, `s_destinos`...). Contador anônimo de acessos: qualquer visitante só soma +1 (regras em `firestore.rules`); só admin lê. Gravado por `src/utils/track.js`, por uma conexão do Firestore sem cache offline (`statsDb` em `src/firebase.js`). Visitas de admin e "não rastrear" não contam.
- `users/{uid}`: goal, languages[], budget, roadmap{etapaId: boolean}, budgetPlan{values, months}, favorites{countries[], places[], resources[], courses[], calls[], channels[]}, updatedAt

Os `id` de `src/data/options.js` e `src/data/roadmap.js` são gravados no Firestore: não renomeie sem migrar os dados.
Os idiomas de `countries.languages` precisam usar os mesmos ids de `LANGUAGES` (em minúsculas, com acento).
Ao adicionar campos em `users/{uid}`, atualize também `validProfile()` em `firestore.rules`.

## Rotas
- Públicas (sem login): `/`, `/destinos`, `/destinos/:id`, `/comparar`, `/lugares`, `/lugares/:id`, `/cursos`, `/editais`, `/canais`, `/recursos`, `/entrar`.
- Também públicas: `/sobre` (créditos e missão; quem desenvolveu (`AUTHOR`) e o e-mail de contato (`CONTACT`) ficam em `src/data/credits.js`).
- Pessoais (`RequireAuth` em `App.jsx`): `/caminho`, `/orcamento`, `/favoritos`, `/perfil`. Quem não tem objetivo salvo faz o onboarding.
- Admin (`RequireAdmin`): `/admin`, `/admin/acessos` (contador de acessos), `/admin/:colecao`, `/admin/:colecao/:id` (`novo` cria).

## Convenções
- Conteúdo curado (países, lugares, cursos, editais e recursos) nasce em `seed/*.json`, é **somente leitura** para o público e editável só por administradores, no painel `/admin` (ver `firestore.rules`). O `npm run seed` sobrescreve o que foi editado no painel: depois de editar, use `npm run seed -- --somente-novos`.
- Dados do usuário ficam em `users/{uid}`; nunca ler nem escrever dados de outro usuário.
- Textos: voz ativa, frases curtas, botões dizem exatamente o que fazem.
- Mensagens de erro explicam o que aconteceu e o que a pessoa pode fazer.
- Editais: nunca inventar datas. `opensAt` e `closesAt` ficam vazios até alguém confirmar no site oficial; a tela mostra "confirme no site oficial".
- Cursos de diploma online: manter o aviso de revalidação do diploma.
- Canais do YouTube: só entram canais cujo endereço foi confirmado. Canal de agência ou de quem vende mentoria leva o aviso (`kind: agencia` ou `note`). O app não tem vínculo com os canais.
- Visto: sempre com link oficial do governo e o aviso "Regras de visto mudam. Confirme no site oficial." (componente `VisaNotice`). Não inventar valores nem prazos.
- Identidade visual: passaporte e carimbos. Azul-marinho `#1b2a4e`, papel de visto `#e8eef0`, carimbos verde `#0e7c66` e magenta `#9c2f63` alternados. Fontes Bricolage Grotesque (títulos) e Atkinson Hyperlegible (texto). O destaque visual fica nos carimbos; o resto é sóbrio.
- Acessibilidade: foco visível, `aria-pressed` em botões de alternância, contraste AA, respeitar `prefers-reduced-motion`, alvos de toque com pelo menos 44px.
- Commits em português, um por etapa, com `npm run build` passando.

## Regras de segurança do repositório
- Nunca commitar `.env`, `.firebaserc` ou `serviceAccount*.json` (já estão no `.gitignore`).
- Não fazer deploy nem criar recursos no Firebase sem pedir antes.

## Próximos passos
Ver `docs/ROADMAP.md`.
