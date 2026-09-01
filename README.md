# 📱 FinEdu — Educação Financeira Gamificada

> **Projeto Integrador 5 (PEI 5)**  
> Aplicativo móvel de microlearning gamificado para tomada de decisões financeiras seguras e proteção contra fraudes digitais, focado no público jovem e microempreendedores da Baixada Cuiabana.

---

## 🌟 Visão Geral

O **FinEdu** utiliza dinâmicas de **Roleplay e Gamificação (Níveis, XP e Avatares evolutivos)** para ensinar educação financeira na prática. Em vez de aulas puramente teóricas, o usuário vivencia cenários cotidianos de risco (mensagens suspeitas, golpes de Pix/WhatsApp, falsos comprovantes) e toma decisões em tempo real com consequências imediatas e dicas educativas.

---

## 🚀 Funcionalidades do MVP

- 🔐 **Autenticação Segura:** Cadastro e login com e-mail/senha via Firebase Authentication.
- 🎭 **Onboarding com Avatares:** Escolha de personagens que evoluem visualmente conforme o nível de XP.
- ⚡ **Sistema de Progressão (XP & 5 Níveis):**
  - **Nível 1:** Iniciante (0 XP)
  - **Nível 2:** Aprendiz (150 XP)
  - **Nível 3:** Consciente (350 XP)
  - **Nível 4:** Estrategista (600 XP)
  - **Nível 5:** Guardião Financeiro (900 XP)
- 📚 **Trilha "Golpes Pix e WhatsApp":** 8 lições completas com cenários de phishing, falso parente, falsas vagas, falso comprovante, engenharia social e o desafio do Guardião Financeiro.
- 🎮 **Motor de Lições Dinâmico (Roleplay):**
  - *NarrativeSlide:* Contextualização do caso real.
  - *DecisionSlide:* Decisão interativa sob pressão.
  - *ConsequenceSlide:* Resultado didático da escolha + Dica do Guardião.
  - *XPRewardSlide:* Recompensa e feedback imediato.
  - *LevelUpModal:* Modal celebrando novos níveis atingidos.
- 📶 **Suporte Offline:** Persistência em cache nativa via Cloud Firestore.
- 🌐 **Deploy Web & Mobile:** Compatível com Android (APK/Expo Go), iOS (Expo Go) e Web responsiva.

---

## 🛠️ Tecnologias Utilizadas

- **Front-end:** [React Native](https://reactnative.dev/) com [Expo SDK 57](https://expo.dev/) (TypeScript)
- **Roteamento:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) com [NativeWind](https://www.nativewind.dev/)
- **Gerenciamento de Estado:** [Zustand](https://github.com/pmndrs/zustand)
- **Back-end & Banco de Dados:** [Firebase](https://firebase.google.com/) (Auth, Cloud Firestore e Hosting)

---

## 📁 Estrutura do Projeto

```
finEdu/
├── app/                        # Rotas e Telas (Expo Router)
│   ├── (auth)/                 # Grupo de Autenticação (Login, Cadastro)
│   ├── (app)/                  # Grupo Principal com Tab Navigator
│   │   ├── index.tsx           # Dashboard / Home com barra de XP
│   │   ├── trails/             # Trilhas e Lista de Lições
│   │   │   └── lesson/[id].tsx # Motor interativo de Lições
│   │   └── profile.tsx         # Perfil, Estatísticas e Jornada
│   ├── onboarding/             # Seleção de Avatar
│   └── _layout.tsx             # Observer de Auth e controle de rotas
├── components/                 # Componentes Reutilizáveis
│   ├── slides/                 # Slides da Lição (Narrativa, Decisão, etc.)
│   └── gamification/           # Modais e badges de Gamificação
├── constants/                  # Constantes (Tabela de Níveis e XP)
├── docs/                       # Documentação Oficial (PRD e Arquitetura)
│   ├── PRD_FinEdu_App.md
│   └── Arquitetura_FinEdu.md
├── scripts/                    # Scripts utilitários (Seed do Firestore)
├── services/                   # Integração Firebase (Auth, Firestore, Progresso)
├── store/                      # Zustand Store (Estado do Usuário e XP)
└── types/                      # Interfaces TypeScript
```

---

## 💻 Como Rodar o Projeto Localmente

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18+)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Aplicativo **Expo Go** instalado no celular (Android ou iOS)

### 2. Clonar e Instalar Dependências
```bash
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
cd finEdu
npm install --legacy-peer-deps
```

### 3. Configurar as Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz de `finEdu` baseado no `.env.example`:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=sua_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

### 4. Popular o Banco de Dados (Seed Inicial)
Para carregar as 8 lições e níveis no Firestore:
```bash
node ./scripts/seed.mjs
```

### 5. Iniciar o Aplicativo
```bash
npx expo start
```
- Aponte a câmera do celular com o **Expo Go** para ler o QR Code, ou pressione `w` para abrir no navegador.

---

## 📚 Documentação Técnica Adicional
- [Documento de Requisitos de Produto (PRD)](./docs/PRD_FinEdu_App.md)
- [Diagramas de Arquitetura e Fluxo de Dados](./docs/Arquitetura_FinEdu.md)

---

## 👥 Equipe
Projeto desenvolvido para o **Projeto Integrador 5 (PEI 5)** — Baixada Cuiabana.
