# PRD — FinEdu: Educação Financeira Gamificada
### Projeto Integrador 5 (PEI 5) — Versão 1.0
**Status:** Em Planejamento | **Última atualização:** 01/09/2026  
**Documento gerado após:** Entrevista estratégica de discovery de produto

---

## 1. Visão Geral do Produto

### 1.1 Resumo Executivo

**FinEdu** é um aplicativo móvel de microlearning gamificado que capacita jovens adultos e microempreendedores informais da Baixada Cuiabana a tomarem decisões financeiras mais seguras — começando pela proteção contra golpes digitais (Pix/WhatsApp) e evoluindo para temas como orçamento pessoal, reserva de emergência e formalização MEI.

O diferencial do produto é a combinação de **narrativa interativa baseada em cenários reais** (roleplay de decisão) com um **sistema de progressão por XP e Níveis** que evolui visualmente o avatar do usuário — criando uma experiência de aprendizado onde cada escolha tem consequências claras e recompensas imediatas.

### 1.2 Declaração do Problema

> Jovens adultos e microempreendedores informais da Baixada Cuiabana possuem baixo letramento financeiro digital, tornando-os vulneráveis a golpes via Pix e WhatsApp, ao endividamento por falta de planejamento e à informalidade econômica por desconhecimento do processo de formalização MEI. Os conteúdos de educação financeira existentes são massivos, textuais e não se conectam à realidade cultural e econômica local.

### 1.3 Proposta de Valor

| Para | O problema é | O FinEdu oferece |
|---|---|---|
| Jovens adultos (18–35 anos) | Vulnerabilidade a golpes digitais e falta de planejamento | Lições em formato de história interativa com decisões reais e consequências imediatas |
| Microempreendedores informais | Desconhecimento sobre MEI e gestão básica | Trilha guiada de formalização com passo a passo gamificado |
| Parceiros institucionais (ONGs/Universidade) | Ausência de ferramenta digital de capacitação acessível | Plataforma com conteúdo configurável via Firebase, sem necessidade de atualizar o app |

---

## 2. Contexto e Público-Alvo

### 2.1 Contexto Regional

- **Região:** Baixada Cuiabana (Cuiabá e municípios do entorno, MT)
- **Parceria institucional:** Projeto de extensão universitária ou ONGs de capacitação local
- **Conectividade:** Intermitente em áreas periféricas → app deve funcionar com cache offline
- **Dispositivos predominantes:** Android de entrada e intermediário

### 2.2 Personas

#### Persona 1 — Ana, 23 anos, atendente de farmácia
- Renda mensal de R\$ 1.800, sem conta poupança
- Já quase caiu em um golpe de Pix "por engano"
- Usa TikTok e Instagram diariamente
- **Dor principal:** Não sabe se está gastando mais do que ganha

#### Persona 2 — Carlos, 34 anos, vendedor de lanches na rua
- Faturamento mensal variável (~R\$ 3.000)
- Sabe que deveria se formalizar como MEI mas "nunca entendeu o processo"
- Celular Android, internet 4G instável
- **Dor principal:** Medo de impostos e burocracia para se formalizar

#### Persona 3 — Juliana, 19 anos, estudante universitária
- Primeiro emprego, recém-chegada ao mercado de trabalho
- Recebe pelo Pix, usa muito WhatsApp
- **Dor principal:** Nunca aprendeu sobre dinheiro em casa ou na escola

---

## 3. Objetivos e Métricas de Sucesso

### 3.1 Objetivos do MVP (Projeto Acadêmico)

| OKR | Objetivo | Key Result |
|---|---|---|
| O1 | Entregar um app funcional com backend real | App com Firebase Auth + Firestore rodando em Android via APK |
| O2 | Validar o modelo de aprendizado narrativo | 1 trilha completa (Golpes Pix/WhatsApp) com 8 lições interativas |
| O3 | Demonstrar gamificação operacional | Sistema de XP + 5 Níveis + evolução visual de avatar funcionando |
| O4 | Garantir escalabilidade de conteúdo | Engine dinâmico: novas lições adicionáveis no Firebase sem alterar código |

### 3.2 Métricas de Validação (para apresentação acadêmica)

- **Taxa de conclusão da trilha:** % de usuários de teste que completam todas as 8 lições
- **Tempo médio por lição:** meta de 3–5 minutos por sessão
- **NPS simplificado:** Pesquisa de satisfação ao final da trilha (escala 1–5)
- **Funcionamento offline:** Demonstração de acesso ao conteúdo sem internet após cache inicial

---

## 4. Escopo do MVP

### 4.1 Critério de "Pronto" (Definition of Done)

O MVP é considerado completo quando:
- [ ] Usuário consegue criar conta com e-mail + senha e ter sessão persistida
- [ ] Trilha "Golpes Pix/WhatsApp" está completa com 8 lições no Firestore
- [ ] Cada lição segue o formato: Cenário → Decisão Interativa → Consequência + XP
- [ ] Sistema de XP acumula corretamente e avança o usuário entre 5 níveis
- [ ] Avatar muda de aparência ao atingir cada novo nível
- [ ] App funciona com dados em cache quando offline (Firestore persistence)
- [ ] APK Android gerado e instalável em dispositivo físico

### 4.2 O que está FORA do MVP (Backlog v2)

- Trilhas de Orçamento Pessoal, MEI e Reserva de Emergência
- Simulador financeiro standalone com orçamento dinâmico (salário fictício completo)
- Ranking/Leaderboard entre usuários
- Loja de itens cosméticos com moeda virtual
- Notificações push / streak diária (modelo Duolingo)
- Painel administrativo para gestão de conteúdo
- Login social com Google
- Integração com parceiros institucionais (API externa)

---

## 5. Funcionalidades Detalhadas

### 5.1 Épico 1 — Autenticação e Onboarding

**E1.F1 — Cadastro com e-mail e senha**
- Campos: nome, e-mail, senha (mínimo 8 caracteres)
- Validação de e-mail em tempo real
- Firebase Auth gerencia a sessão (persistência automática)
- Senha com opção de visualização (olho)

**E1.F2 — Seleção de Avatar Inicial**
- Tela pós-cadastro apresenta grade com 6 avatares pré-desenhados
- Avatares representam diversidade regional (gênero, etnia)
- Avatar escolhido é salvo no Firestore (coleção `users/{uid}`)
- **Lógica de evolução:** cada avatar tem 5 variações visuais, uma para cada nível

**E1.F3 — Tela de Boas-Vindas / Tour**
- Carousel de 3 telas explicando: "O que é o FinEdu", "Como funciona o XP", "O que você vai aprender"
- Botão "Começar" leva à Home

**Regra de Negócio:**
> Se o usuário já tem sessão ativa no Firebase, o app deve pular direto para a Home, sem passar pelo onboarding novamente.

---

### 5.2 Épico 2 — Home e Navegação

**E2.F1 — Dashboard do Usuário**
- Header com: avatar (nível atual), nome, XP atual e barra de progresso para o próximo nível
- Card de "Trilha em Progresso" com % de conclusão
- Seção "Trilhas Disponíveis" (apenas Golpes Pix/WhatsApp desbloqueada no MVP; demais aparecem com cadeado e tag "Em breve")

**E2.F2 — Perfil do Usuário**
- Avatar em tamanho maior com indicador de nível
- Nome, e-mail (somente leitura)
- XP total acumulado e nível atual
- Histórico de lições concluídas (lista simples)
- Botão de logout

**Navegação bottom-bar:** Home | Trilhas | Perfil

---

### 5.3 Épico 3 — Motor de Trilhas e Lições (Engine Dinâmico)

> [!IMPORTANT]
> Esta é a decisão arquitetural mais crítica do produto. Todo o conteúdo das lições é armazenado no Firestore como documentos JSON estruturados. O app é um **renderizador genérico** — não há lógica de conteúdo hardcoded no código.

**E3.F1 — Tela de Trilha**
- Lista das 8 lições com: título, ícone temático, status (bloqueada/disponível/concluída)
- Desbloqueio sequencial: cada lição só abre após a anterior ser concluída
- XP ganho por lição exibido como badge

**E3.F2 — Engine de Lição (Formato Roleplay)**

Cada lição é composta por N **slides** (documentos aninhados no Firestore). Tipos de slide:

| Tipo | Descrição | Componente UI |
|---|---|---|
| `narrative` | Quadro com narrador, personagem e texto da cena | `NarrativeSlide` |
| `decision` | Pergunta + 2 a 4 botões de escolha | `DecisionSlide` |
| `consequence` | Resultado da decisão tomada (positiva ou negativa) com explicação didática | `ConsequenceSlide` |
| `xp_reward` | Tela de celebração com XP ganho, confetes e botão "Continuar" | `XPRewardSlide` |

**Modelo de dados de uma lição (Firestore):**
```json
{
  "id": "lesson_golpes_001",
  "trailId": "trail_golpes",
  "title": "A Mensagem Suspeita",
  "order": 1,
  "xpReward": 50,
  "slides": [
    {
      "type": "narrative",
      "character": "joao",
      "text": "João acaba de receber uma mensagem no WhatsApp: 'Seu Pix de R$ 1.500 foi enviado com erro. Clique aqui para estornar.'",
      "background": "phone_screen"
    },
    {
      "type": "decision",
      "question": "O que João deve fazer?",
      "options": [
        { "id": "A", "text": "Clicar no link para verificar", "isCorrect": false },
        { "id": "B", "text": "Ignorar e bloquear o número", "isCorrect": true },
        { "id": "C", "text": "Ligar para o número que enviou", "isCorrect": false }
      ]
    },
    {
      "type": "consequence",
      "forOption": "A",
      "isNegative": true,
      "text": "João clicou no link e seus dados bancários foram roubados. Golpistas nunca usam links para estornar Pix — isso é uma fraude conhecida como 'phishing'.",
      "tip": "Bancos NUNCA pedem dados pessoais por link de WhatsApp."
    },
    {
      "type": "consequence",
      "forOption": "B",
      "isNegative": false,
      "text": "Boa decisão! João protegeu seus dados. Mensagens pedindo para 'estornar' um Pix por link são sempre golpes.",
      "tip": "Em caso de dúvida, entre em contato direto pelo app oficial do seu banco."
    }
  ]
}
```

**E3.F3 — Lógica de Consequência Ramificada**
- Se a decisão for correta: slide de `consequence` positiva → `xp_reward` com XP cheio
- Se a decisão for incorreta: slide de `consequence` negativa → `xp_reward` com XP reduzido (50% da recompensa) + explicação do erro
- Não há "game over" — o usuário sempre avança, mas aprende com a consequência

**Regras de Negócio:**
> - Uma lição concluída não pode ser "desfeita" — o progresso é permanente
> - O XP é creditado uma única vez por lição (completar novamente não dá XP extra)
> - A ordem dos slides é determinada pelo campo `order` dentro do array `slides`

---

### 5.4 Épico 4 — Sistema de Gamificação (XP + Níveis + Avatar)

**E4.F1 — Tabela de Níveis e XP**

| Nível | Nome | XP Necessário (acumulado) | Mudança no Avatar |
|---|---|---|---|
| 1 | Iniciante | 0 | Avatar base (roupa simples) |
| 2 | Aprendiz | 150 | Adiciona acessório (mochila/bolsa) |
| 3 | Consciente | 350 | Roupa muda de cor, expressão mais confiante |
| 4 | Estrategista | 600 | Acessório premium (óculos/relógio) |
| 5 | Guardião Financeiro | 900 | Visual completo, badge dourado no perfil |

> [!NOTE]
> Com 8 lições e uma média de ~60 XP cada (considerando erros e acertos), o usuário completa a trilha com ~480 XP, chegando ao Nível 4. O Nível 5 é um objetivo de longo prazo, motivando o retorno para trilhas futuras.

**E4.F2 — Atualização de Nível (Regra de Negócio)**
- Após cada lição concluída, o sistema calcula o novo total de XP
- Se o XP acumulado ultrapassar o limiar do próximo nível, a tela de **Level Up** é exibida
- A tela de Level Up mostra: antes → depois do avatar, nome do novo nível, mensagem de parabéns
- O documento do usuário no Firestore é atualizado: `{ xp: total, level: novoNivel, avatarVariant: novoNivel }`

**E4.F3 — Persistência de Progresso**
- Progresso por lição salvo em: `users/{uid}/progress/{lessonId}` = `{ completed: true, xpEarned: N, completedAt: timestamp }`
- XP total e nível armazenados em: `users/{uid}` = `{ xp: N, level: N, avatarId: 'avatar_2', avatarVariant: 3 }`

---

### 5.5 Épico 5 — Modo Offline

**E5.F1 — Estratégia de Cache (Firestore Offline Persistence)**
- Firestore offline persistence ativado no boot do app
- Trilhas e lições são carregadas no cache na primeira abertura com internet
- Progressos registrados offline são sincronizados automaticamente quando a conexão volta
- Banner sutil de "Modo Offline" exibido quando sem internet

**Regra de Negócio:**
> O app nunca deve bloquear o usuário por falta de internet se o conteúdo já foi carregado no cache. A única ação que exige conexão é o cadastro/login inicial.

---

## 6. Conteúdo — Trilha "Golpes Pix/WhatsApp" (MVP)

### 6.1 Estrutura das 8 Lições

| # | Título | Tipo de Golpe Abordado | XP Recompensa |
|---|---|---|---|
| 1 | A Mensagem Suspeita | Phishing via WhatsApp ("estorno de Pix") | 50 |
| 2 | O Link do Banco | Links falsos de notificação bancária | 60 |
| 3 | A Promoção Imperdível | Compra online falsa com Pix | 60 |
| 4 | O Parente em Apuros | Golpe do "filho pedindo dinheiro" | 70 |
| 5 | A Vaga de Emprego | Golpe de falsa seleção com depósito | 70 |
| 6 | O Bilhete Premiado | Golpe da loteria/sorteio via WhatsApp | 80 |
| 7 | A Chave Pix Errada | Golpe do Pix "enviado por engano" | 80 |
| 8 | Você é o Guardião | Cenário reverso: o usuário ajuda outro personagem | 100 |

**XP Total máximo da trilha (com acerto em todos): 570 XP**

### 6.2 Personagens Narrativos

| Personagem | Papel | Visual |
|---|---|---|
| **João** | Protagonista jovem adulto, trabalhador | Jovem, 25 anos, estilo casual |
| **Dona Cida** | Personagem vulnerável, representa idosos e menos digitais | Mulher, ~55 anos |
| **Golpista (sem rosto)** | Antagonista, representado por ícone de tela de celular | Nunca aparece fisicamente |
| **Assistente FinEdu** | Narrador/guia, dá as dicas ao final de cada consequência | Mascote do app |

---

## 7. Arquitetura Técnica — Visão Geral

### 7.1 Stack Tecnológico

| Camada | Tecnologia | Justificativa |
|---|---|---|
| **Mobile** | React Native + Expo SDK | Cross-platform, APK Android sem Xcode, Expo Go para iOS |
| **Linguagem** | TypeScript | Tipagem estática, segurança no modelo de dados do Firestore |
| **Autenticação** | Firebase Authentication (e-mail/senha) | Zero infraestrutura própria, gestão de sessão automática |
| **Banco de dados** | Cloud Firestore | NoSQL flexível, offline persistence nativa, tempo real |
| **Armazenamento de mídia** | Firebase Storage | Imagens dos avatares e assets das lições |
| **Navegação** | Expo Router (file-based) | Padrão moderno do ecossistema Expo |
| **Estado global** | Zustand | Leve, sem boilerplate, ideal para estado de sessão e XP |
| **Estilo** | NativeWind (Tailwind para RN) | Produtividade e consistência visual |

### 7.2 Estrutura de Coleções no Firestore

```
firestore/
├── users/
│   └── {uid}/
│       ├── displayName: string
│       ├── email: string
│       ├── avatarId: string           # ex: "avatar_1"
│       ├── avatarVariant: number      # 1–5 (evolução por nível)
│       ├── xp: number
│       ├── level: number
│       ├── createdAt: timestamp
│       └── progress/
│           └── {lessonId}/
│               ├── completed: boolean
│               ├── xpEarned: number
│               └── completedAt: timestamp
│
├── trails/
│   └── {trailId}/
│       ├── title: string
│       ├── description: string
│       ├── order: number
│       ├── isLocked: boolean
│       └── lessons/
│           └── {lessonId}/
│               ├── title: string
│               ├── order: number
│               ├── xpReward: number
│               └── slides: array<Slide>
│
└── config/
    └── levels/
        └── {levelId}/
            ├── level: number
            ├── name: string
            ├── xpRequired: number
            └── avatarVariantUnlocked: number
```

### 7.3 Estrutura de Pastas do Projeto (Expo Router)

```
finEdu/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (app)/
│   │   ├── _layout.tsx          # Bottom Tab Navigator
│   │   ├── index.tsx            # Home / Dashboard
│   │   ├── trails/
│   │   │   ├── index.tsx        # Lista de trilhas
│   │   │   ├── [trailId].tsx    # Detalhes da trilha + lista de lições
│   │   │   └── lesson/
│   │   │       └── [lessonId].tsx  # Engine de lição (renderizador)
│   │   └── profile.tsx
│   └── onboarding/
│       └── avatar-select.tsx
├── components/
│   ├── slides/
│   │   ├── NarrativeSlide.tsx
│   │   ├── DecisionSlide.tsx
│   │   ├── ConsequenceSlide.tsx
│   │   └── XPRewardSlide.tsx
│   ├── gamification/
│   │   ├── XPBar.tsx
│   │   ├── LevelBadge.tsx
│   │   └── LevelUpModal.tsx
│   └── Avatar.tsx
├── services/
│   ├── firebase.ts              # Inicialização Firebase
│   ├── auth.service.ts
│   ├── trail.service.ts
│   └── progress.service.ts
├── store/
│   └── useUserStore.ts          # Zustand: sessão, XP, nível
├── types/
│   └── index.ts                 # Trail, Lesson, Slide, User types
└── constants/
    └── levels.ts                # Tabela de níveis (fallback local)
```

---

## 8. Roadmap

### MVP (v1.0) — Entrega Acadêmica

```
Semana 1–2:   Setup Expo + Firebase, autenticação, onboarding
Semana 3–4:   Engine de lição (NarrativeSlide, DecisionSlide, ConsequenceSlide)
Semana 5–6:   Sistema de XP + Níveis + LevelUpModal + evolução de avatar
Semana 7:     Produção de conteúdo: 8 lições no Firestore
Semana 8:     Testes, ajustes de UI, geração de APK
```

### v2.0 — Pós-Entrega / Expansão

- [ ] Trilha de Orçamento Pessoal (complementa os Golpes: "E agora que evitei o golpe, como gerencio meu dinheiro?")
- [ ] Trilha de Reserva de Emergência
- [ ] Trilha de Formalização MEI
- [ ] Simulador Financeiro Standalone (orçamento dinâmico com salário fictício e decisões de compra)
- [ ] Sistema de Ofensiva (streak diária) + Notificações Push
- [ ] Ranking por região (Leaderboard)
- [ ] Loja de cosméticos com moeda virtual
- [ ] Painel administrativo para gestão de conteúdo (adição de lições sem deploy)
- [ ] Login social com Google

---

## 9. Requisitos Não-Funcionais

| Requisito | Especificação |
|---|---|
| **Performance** | Tempo de carregamento de lição < 2s com internet; < 0.5s com cache |
| **Offline** | 100% das lições já vistas disponíveis sem internet |
| **Acessibilidade** | Textos com tamanho mínimo de 16sp; contraste mínimo WCAG AA |
| **Segurança** | Firebase Security Rules: usuário só acessa/escreve no próprio documento `users/{uid}` |
| **Compatibilidade** | Android 8.0+ (API 26+); iOS 14+ (via Expo Go) |
| **Tamanho do APK** | Meta: < 50MB (assets otimizados, imagens comprimidas) |

### 9.1 Firebase Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Usuários só leem/escrevem no próprio documento
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /progress/{lessonId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }

    // Trilhas e lições: leitura pública para usuários autenticados
    match /trails/{trailId} {
      allow read: if request.auth != null;

      match /lessons/{lessonId} {
        allow read: if request.auth != null;
      }
    }

    // Config de níveis: leitura pública para usuários autenticados
    match /config/{document=**} {
      allow read: if request.auth != null;
    }
  }
}
```

---

## 10. Critérios de Aceitação por Funcionalidade

### CA-01: Cadastro e Login
- **Dado** que o usuário preenche nome, e-mail válido e senha com 8+ caracteres
- **Quando** clica em "Criar conta"
- **Então** é redirecionado para seleção de avatar e um documento é criado em `users/{uid}`

### CA-02: Seleção de Avatar
- **Dado** que o usuário está na tela de seleção
- **Quando** toca em um avatar e confirma
- **Então** o `avatarId` e `avatarVariant: 1` são salvos no Firestore e o usuário vai para a Home

### CA-03: Execução de Lição
- **Dado** que o usuário inicia uma lição disponível
- **Quando** navega pelos slides e faz uma escolha no `DecisionSlide`
- **Então** o slide de `ConsequenceSlide` correspondente à opção é exibido, seguido do `XPRewardSlide`

### CA-04: Crédito de XP e Level Up
- **Dado** que o usuário conclui uma lição e o XP acumulado ultrapassa o limiar do próximo nível
- **Quando** o `XPRewardSlide` é dispensado
- **Então** o modal de `LevelUpModal` é exibido com a evolução visual do avatar antes → depois

### CA-05: Modo Offline
- **Dado** que o usuário acessou a trilha ao menos uma vez com internet
- **Quando** o dispositivo fica sem conexão
- **Então** o app carrega as lições do cache do Firestore e exibe o banner "Você está offline — seu progresso será sincronizado quando voltar"

### CA-06: Persistência de Sessão
- **Dado** que o usuário fez login anteriormente
- **Quando** fecha e reabre o app
- **Então** é redirecionado diretamente para a Home, sem passar pelo login ou onboarding

---

## 11. Glossário

| Termo | Definição |
|---|---|
| **XP** | Experience Points — pontos acumulados ao concluir lições |
| **Nível** | Estágio de progressão do usuário (1 a 5 no MVP) |
| **Trilha** | Conjunto de lições sobre um tema específico |
| **Lição** | Unidade de aprendizado composta por múltiplos slides |
| **Slide** | Tela individual dentro de uma lição (narrative, decision, consequence, xp_reward) |
| **Engine de Lição** | Componente renderizador genérico que interpreta os dados do Firestore |
| **Avatar Variant** | Variação visual do avatar correspondente ao nível atual do usuário |
| **Offline Persistence** | Funcionalidade nativa do Firestore que mantém cache local do banco de dados |
| **APK** | Android Package — arquivo de instalação do app para Android |
| **MEI** | Microempreendedor Individual — categoria de formalização empresarial simplificada |
| **Phishing** | Técnica de golpe que usa mensagens falsas para roubar dados pessoais |
