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
- `npm run preview`: serve o build localmente
- `npm run emulators`: emuladores de Auth e Firestore (projeto `demo-carimbo`; precisa do Firebase CLI e de Java)
- `npm run seed:emulador`: envia `seed/*.json` para o emulador
- `npm run seed`: envia `seed/*.json` para o Firestore de produção (usa `serviceAccount.json` ou `GOOGLE_APPLICATION_CREDENTIALS`)
- `npm run deploy`: build + deploy manual de Hosting e regras do Firestore

Para usar os emuladores no app, coloque `VITE_USE_EMULATORS=true` no `.env`.

## Estrutura
- `src/firebase.js`: inicialização do Firebase (lê o `.env`)
- `src/contexts/AuthContext.jsx`: usuário logado + perfil `users/{uid}` em tempo real, `saveProfile()` com merge
- `src/hooks/useFirestore.js`: `useCollection` e `useDocument` com loading e erro; `useFavorites.js`: favoritos em `users/{uid}.favorites`
- `src/data/`: opções fixas (`options.js`), etapas do caminho (`roadmap.js`), itens e contas do orçamento (`budget.js`), mensagens de erro do Auth (`authErrors.js`)
- `public/`: `manifest.webmanifest`, ícones e `sw.js` (PWA: app abre sem internet)
- `src/components/`: `Layout`, `Stamp` (carimbo SVG), `ChipGroup`, `VisaNotice`, `LoadState`, `Icons`, `PlaceRow`, `FavoriteButton`
- `src/pages/`: `Login`, `Profile` (onboarding e aba Perfil), `Roadmap`, `Destinations`, `Country`, `Places`, `Place`, `Resources`, `Favorites`, `Budget`
- `seed/`: conteúdo curado (`countries`, `places`, `resources`); `scripts/seed.mjs`: envia o seed com firebase-admin

## Modelo de dados (Firestore)
- `countries/{id}`: name, flag, languages[], summary, costLevel (1-3), visa{name, work, officialUrl}, work{students, programs[{name, description, url?}], jobSites[{title, url}]}, highlights[], updatedAt
- `places/{id}`: countryId, name, summary, costNote (texto relativo, sem valores), goals[], study[], work[], living[], universities[{name, url}], updatedAt
- `resources/{id}`: title, url, category, free, countries[], description, updatedAt
- `users/{uid}`: goal, languages[], budget, roadmap{etapaId: boolean}, budgetPlan{values, months}, favorites{countries[], places[], resources[]}, updatedAt

Os `id` de `src/data/options.js` e `src/data/roadmap.js` são gravados no Firestore: não renomeie sem migrar os dados.
Os idiomas de `countries.languages` precisam usar os mesmos ids de `LANGUAGES` (em minúsculas, com acento).
Ao adicionar campos em `users/{uid}`, atualize também `validProfile()` em `firestore.rules`.

## Convenções
- Conteúdo curado (países e recursos) mora em `seed/*.json` e é **somente leitura** no app (ver `firestore.rules`).
- Dados do usuário ficam em `users/{uid}`; nunca ler nem escrever dados de outro usuário.
- Textos: voz ativa, frases curtas, botões dizem exatamente o que fazem.
- Mensagens de erro explicam o que aconteceu e o que a pessoa pode fazer.
- Visto: sempre com link oficial do governo e o aviso "Regras de visto mudam. Confirme no site oficial." (componente `VisaNotice`). Não inventar valores nem prazos.
- Identidade visual: passaporte e carimbos. Azul-marinho `#1b2a4e`, papel de visto `#e8eef0`, carimbos verde `#0e7c66` e magenta `#9c2f63` alternados. Fontes Bricolage Grotesque (títulos) e Atkinson Hyperlegible (texto). O destaque visual fica nos carimbos; o resto é sóbrio.
- Acessibilidade: foco visível, `aria-pressed` em botões de alternância, contraste AA, respeitar `prefers-reduced-motion`, alvos de toque com pelo menos 44px.
- Commits em português, um por etapa, com `npm run build` passando.

## Regras de segurança do repositório
- Nunca commitar `.env`, `.firebaserc` ou `serviceAccount*.json` (já estão no `.gitignore`).
- Não fazer deploy nem criar recursos no Firebase sem pedir antes.

## Próximos passos
Ver `docs/ROADMAP.md`.
