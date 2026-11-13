# Carimbo

Guia web para brasileiros que querem aprender idiomas, fazer intercâmbio e estudar fora do Brasil.
A pessoa monta o perfil, escolhe destinos, encontra bolsas e cursos e acompanha 8 etapas até o embarque.
Cada etapa concluída ganha um carimbo no passaporte.

**Stack:** React 18 + Vite 5, Firebase (Authentication, Firestore e Hosting) e GitHub Actions.

---

## Sumário
1. [O que você precisa](#1-o-que-você-precisa)
2. [Criar o projeto no Firebase](#2-criar-o-projeto-no-firebase)
3. [Ativar o login (Authentication)](#3-ativar-o-login-authentication)
4. [Criar o banco de dados (Firestore)](#4-criar-o-banco-de-dados-firestore)
5. [Baixar o código e preencher o .env](#5-baixar-o-código-e-preencher-o-env)
6. [Publicar as regras de segurança](#6-publicar-as-regras-de-segurança)
7. [Enviar o conteúdo inicial (seed)](#7-enviar-o-conteúdo-inicial-seed)
8. [Rodar no seu computador](#8-rodar-no-seu-computador)
9. [Publicar o site](#9-publicar-o-site)
10. [Deploy automático pelo GitHub](#10-deploy-automático-pelo-github)
11. [Testar sem internet com os emuladores (opcional)](#11-testar-sem-internet-com-os-emuladores-opcional)
12. [Estrutura do projeto](#12-estrutura-do-projeto)
13. [Problemas comuns](#13-problemas-comuns)

---

## 1. O que você precisa

- Uma conta Google.
- **Node.js 20 ou mais novo.** Baixe em https://nodejs.org (versão LTS). Para conferir, abra o terminal e rode:
  ```bash
  node -v
  ```
- **Git.** Baixe em https://git-scm.com.
- **Firebase CLI**, a ferramenta de linha de comando do Firebase:
  ```bash
  npm install -g firebase-tools
  firebase login
  ```
  O `firebase login` abre o navegador para você entrar com sua conta Google.

> O plano gratuito do Firebase (Spark) basta para este projeto. Você não precisa cadastrar cartão.

## 2. Criar o projeto no Firebase

1. Acesse https://console.firebase.google.com e clique em **Criar um projeto**.
2. Dê um nome (por exemplo, `carimbo`). O Firebase gera um **ID do projeto**, como `carimbo-1a2b3`. Anote esse ID.
3. O Google Analytics é opcional. Você pode desativar.
4. Com o projeto criado, clique no ícone **Web** (`</>`) para registrar um app da Web.
   - Apelido: `carimbo-web`.
   - Não marque "Firebase Hosting" agora; vamos configurar depois.
5. O Firebase mostra um bloco `firebaseConfig` com `apiKey`, `authDomain` etc. **Deixe essa tela aberta**: você vai copiar esses valores no passo 5.
   Se fechar, encontre de novo em ⚙️ **Configurações do projeto > Geral > Seus apps**.

## 3. Ativar o login (Authentication)

1. No menu lateral, abra **Criação > Authentication** e clique em **Vamos começar**.
2. Na aba **Método de login**:
   - Ative **E-mail/senha** (só a primeira chave) e salve.
   - Ative **Google**, escolha um e-mail de suporte e salve.
3. Na aba **Configurações > Domínios autorizados**, confira se `localhost` está na lista.
   O domínio do Hosting (`SEU-ID.web.app`) entra sozinho quando você publicar.

## 4. Criar o banco de dados (Firestore)

1. No menu lateral, abra **Criação > Firestore Database** e clique em **Criar banco de dados**.
2. **Local:** escolha `southamerica-east1 (São Paulo)`.
   ⚠️ O local não pode ser trocado depois.
3. **Regras:** escolha **Iniciar no modo de produção**. As regras certas vêm do arquivo `firestore.rules`, publicado no passo 6.

## 5. Baixar o código e preencher o .env

```bash
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git carimbo
cd carimbo
npm install
```

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

> No Windows (Prompt de Comando), use `copy .env.example .env`.

Abra o `.env` e preencha com os valores do `firebaseConfig` (passo 2):

| No `firebaseConfig`  | No `.env`                           |
| -------------------- | ----------------------------------- |
| `apiKey`             | `VITE_FIREBASE_API_KEY`             |
| `authDomain`         | `VITE_FIREBASE_AUTH_DOMAIN`         |
| `projectId`          | `VITE_FIREBASE_PROJECT_ID`          |
| `storageBucket`      | `VITE_FIREBASE_STORAGE_BUCKET`      |
| `messagingSenderId`  | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `appId`              | `VITE_FIREBASE_APP_ID`              |

Crie também o `.firebaserc`, que diz ao Firebase CLI qual projeto usar:

```bash
cp .firebaserc.example .firebaserc
```

Abra o `.firebaserc` e troque `SEU-PROJECT-ID` pelo ID do seu projeto.

> 🔒 `.env`, `.firebaserc` e `serviceAccount.json` ficam **fora do Git** (estão no `.gitignore`). Nunca envie esses arquivos para o GitHub.

## 6. Publicar as regras de segurança

As regras dizem quem pode ler e escrever no banco:
- `countries` e `resources`: qualquer pessoa lê e ninguém escreve pelo app.
- `users/{uid}`: só o dono da conta lê e escreve o próprio perfil.

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## 7. Enviar o conteúdo inicial (seed)

O seed grava países, lugares e recursos (pasta `seed/`) no Firestore.

1. No console do Firebase, abra ⚙️ **Configurações do projeto > Contas de serviço**.
2. Clique em **Gerar nova chave privada** e confirme. Um arquivo `.json` é baixado.
3. Renomeie o arquivo para `serviceAccount.json` e mova para a pasta raiz do projeto (a mesma do `package.json`).
4. Rode:
   ```bash
   npm run seed
   ```
   Você deve ver:
   ```
   ✔ 4 documentos gravados em "countries"
   ✔ 12 documentos gravados em "resources"
   Seed concluído.
   ```

> 🔒 Essa chave dá acesso total ao projeto. Guarde bem, não compartilhe e nunca commite. Depois do seed, você pode apagá-la.

Para mudar um texto ou link, edite `seed/*.json` e rode `npm run seed` de novo. O script sobrescreve os mesmos documentos.

## 8. Rodar no seu computador

```bash
npm run dev
```

Abra http://localhost:5173, crie uma conta e teste.

## 9. Publicar o site

```bash
npm run deploy
```

Esse comando gera o build e publica o Hosting e as regras do Firestore.
No final, ele mostra o endereço do site, algo como `https://SEU-ID.web.app`.

## 10. Deploy automático pelo GitHub

O arquivo `.github/workflows/deploy.yml` faz o deploy sozinho:
- **Push na `claude/carimbo-web-app-umx2xc` (ou na `main`, se você criar):** publica no site oficial.
- **Pull request:** publica num link de pré-visualização (válido por 7 dias) e comenta o link no PR.

### 10.1 Criar a conta de serviço do deploy

1. Abra https://console.cloud.google.com/iam-admin/serviceaccounts e selecione o seu projeto no topo.
2. Clique em **Criar conta de serviço**. Nome: `github-deploy`.
3. Dê estes papéis:
   - **Administrador do Firebase Hosting** (Firebase Hosting Admin)
   - **Visualizador do Cloud Run** (Cloud Run Viewer)
   - **Visualizador de chaves de API** (API Keys Viewer)
   - **Administrador do Firebase Authentication** (Firebase Authentication Admin): permite autorizar o domínio das pré-visualizações.
4. Conclua. Na lista, abra a conta `github-deploy` > aba **Chaves** > **Adicionar chave > Criar nova chave > JSON**. Um arquivo é baixado.

### 10.2 Cadastrar os secrets no GitHub

No repositório, abra **Settings > Secrets and variables > Actions > New repository secret** e crie:

| Nome do secret                      | Valor                                                 |
| ----------------------------------- | ----------------------------------------------------- |
| `FIREBASE_SERVICE_ACCOUNT`          | O conteúdo **inteiro** do JSON baixado no passo 10.1 |
| `VITE_FIREBASE_API_KEY`             | Igual ao `.env`                                       |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Igual ao `.env`                                       |
| `VITE_FIREBASE_PROJECT_ID`          | Igual ao `.env`                                       |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Igual ao `.env`                                       |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Igual ao `.env`                                       |
| `VITE_FIREBASE_APP_ID`              | Igual ao `.env`                                       |

Depois de salvar, apague o JSON do seu computador.

### 10.3 Testar

Faça um push na `claude/carimbo-web-app-umx2xc` e acompanhe na aba **Actions** do GitHub. Se ficar verde, o site foi publicado.

> O workflow publica **só o Hosting**. Quando mudar `firestore.rules`, publique as regras com `firebase deploy --only firestore:rules`.

## 11. Testar sem internet com os emuladores (opcional)

Os emuladores rodam Auth e Firestore no seu computador, sem tocar no projeto real. Eles precisam do **Java 11 ou mais novo** instalado.

1. Em um terminal:
   ```bash
   npm run emulators
   ```
2. Em outro terminal:
   ```bash
   npm run seed:emulador
   ```
3. No `.env`, mude para `VITE_USE_EMULATORS=true` e rode `npm run dev`.
4. O painel dos emuladores fica em http://localhost:4000.

Lembre de voltar para `VITE_USE_EMULATORS=false` antes de publicar.

## 12. Estrutura do projeto

```
├─ .github/workflows/deploy.yml   deploy automático
├─ docs/ROADMAP.md                próximas versões
├─ public/favicon.svg
├─ scripts/seed.mjs               envia o seed para o Firestore
├─ seed/                          países, lugares, cursos, editais e recursos (conteúdo curado)
├─ src/
│  ├─ components/                 Layout, Stamp (carimbo), ChipGroup, VisaNotice...
│  ├─ contexts/AuthContext.jsx    usuário logado e perfil
│  ├─ data/                       opções do perfil, etapas, mensagens de erro
│  ├─ hooks/useFirestore.js       leitura de coleções e documentos
│  ├─ pages/                      Login, Profile, Roadmap, Destinations, Country, Resources
│  ├─ firebase.js                 inicialização do Firebase
│  └─ styles.css                  todo o visual (tokens, tema escuro)
├─ firebase.json                  Hosting (SPA), Firestore e emuladores
├─ firestore.rules                regras de segurança
└─ firestore.indexes.json
```

## 13. Problemas comuns

| O que aparece | Como resolver |
| --- | --- |
| Tela "Falta configurar o Firebase" | O `.env` não existe ou está vazio. Refaça o passo 5 e reinicie o `npm run dev`. |
| "Esse tipo de login não está ativado no Firebase" | Ative E-mail/senha e Google no passo 3. |
| "Este endereço não está autorizado no Firebase" | Adicione o domínio em Authentication > Configurações > Domínios autorizados. |
| Destinos vazios | Rode o seed (passo 7). |
| "Não foi possível carregar os destinos" | Publique as regras (passo 6) e confira sua internet. |
| `npm run seed` diz "Faltam as credenciais" | Confira se o `serviceAccount.json` está na raiz do projeto. |
| Deploy falha no GitHub com erro de permissão | Confira os papéis da conta de serviço (10.1) e o secret `FIREBASE_SERVICE_ACCOUNT`. |
| Página 404 ao recarregar em `/destinos` | O `firebase.json` já tem o rewrite de SPA; publique de novo com `npm run deploy`. |

---

Próximas versões: veja [docs/ROADMAP.md](docs/ROADMAP.md).


## Painel admin

O painel fica em `/admin` e permite editar países, cidades, cursos, editais e recursos sem mexer nos arquivos.

### Como virar administrador
1. Entre no app com a sua conta e abra `/admin`. A tela mostra o seu **identificador**.
2. No console do Firebase, abra **Firestore Database** e crie a coleção `admins`.
3. Em **ID do documento**, cole o seu identificador. Crie um campo qualquer (por exemplo `ativo`, com o valor `true`) e salve.
4. Recarregue o app. O Perfil passa a mostrar o link "Painel admin".

Para tirar o acesso, apague o documento. Só o console do Firebase cria ou apaga esses documentos: o app não consegue.

### Acessos ao site
`/admin/acessos` mostra páginas vistas e visitantes de hoje, dos últimos 7 e 30 dias, por dia e por tela. A contagem é anônima (sem nome, e-mail ou IP), ignora as suas visitas como admin e respeita o "não rastrear" do navegador. É uma estimativa: quem fecha a aba muito rápido pode não ser contado. Para dados mais ricos (origem, país, aparelho), o próximo passo é o Google Analytics.

### Cuidados
- Depois de editar pelo painel, rode o seed só com `npm run seed -- --somente-novos`. Para publicar a correção de itens específicos dos arquivos `seed/*.json` sem desfazer o resto, use `npm run seed -- --ids=id1,id2`. Sem essa opção, o seed sobrescreve o que foi editado.
- As regras (`firestore.rules`) mudaram (agora também liberam o contador de acessos): publique-as de novo (`firebase deploy --only firestore` ou pelo console).
- Editais: preencha `Fim das inscrições` só depois de confirmar a data no site oficial.
