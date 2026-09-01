# Arquitetura Técnica — FinEdu App
### Fluxo de Dados: Expo ↔ Firestore ↔ Firebase Auth
**Versão:** 1.0 | **Referência:** PRD FinEdu v1.0

---

## 1. Visão Geral do Sistema

```mermaid
graph TB
    subgraph DEVICE["📱 Dispositivo Android"]
        direction TB
        subgraph EXPO["Expo / React Native App"]
            UI["Camada de UI\n(Telas + Componentes)"]
            STORE["Estado Global\n(Zustand Store)"]
            SERVICES["Camada de Serviços\n(auth / trail / progress)"]
            ROUTER["Expo Router\n(Navegação file-based)"]
        end
        CACHE["🗄️ Cache Local\n(Firestore Offline Persistence\nSQLite interno)"]
    end

    subgraph FIREBASE["☁️ Firebase (Google Cloud)"]
        AUTH["🔐 Firebase Auth\n(e-mail + senha)"]
        FS["📂 Cloud Firestore\n(banco principal)"]
        FSSTORAGE["🖼️ Firebase Storage\n(avatares + assets)"]
    end

    UI <-->|"lê / dispara ações"| STORE
    UI <-->|"navega entre rotas"| ROUTER
    STORE <-->|"chama métodos"| SERVICES
    SERVICES <-->|"SDK Firebase"| AUTH
    SERVICES <-->|"SDK Firestore"| FS
    SERVICES <-->|"SDK Storage"| FSSTORAGE
    FS <-.->|"sync automático\nquando offline"| CACHE
    SERVICES <-.->|"lê do cache\nse sem internet"| CACHE

    style DEVICE fill:#1e293b,stroke:#3b82f6,color:#f1f5f9
    style EXPO fill:#0f172a,stroke:#6366f1,color:#f1f5f9
    style FIREBASE fill:#1c1917,stroke:#f97316,color:#f1f5f9
    style CACHE fill:#14532d,stroke:#22c55e,color:#f1f5f9
```

---

## 2. Fluxo de Autenticação

```mermaid
sequenceDiagram
    actor U as 👤 Usuário
    participant App as Expo App
    participant Store as Zustand Store
    participant AuthSvc as auth.service.ts
    participant FBAuth as Firebase Auth
    participant FS as Firestore

    Note over App: Boot do Aplicativo

    App->>FBAuth: onAuthStateChanged()
    alt Sessão ativa encontrada
        FBAuth-->>App: User token válido
        App->>FS: getDoc(users/{uid})
        FS-->>Store: { xp, level, avatarId, avatarVariant }
        App->>App: Redireciona → Home
    else Sem sessão
        App->>App: Redireciona → Login
    end

    Note over U, FS: Fluxo de Cadastro (novo usuário)

    U->>App: Preenche nome, e-mail, senha
    App->>AuthSvc: register(email, password)
    AuthSvc->>FBAuth: createUserWithEmailAndPassword()
    FBAuth-->>AuthSvc: UserCredential { uid }
    AuthSvc->>FS: setDoc(users/{uid}, { xp:0, level:1, avatarId:null })
    AuthSvc-->>Store: setUser({ uid, email, xp:0, level:1 })
    App->>App: Redireciona → Seleção de Avatar

    Note over U, FS: Seleção de Avatar

    U->>App: Escolhe avatar_3
    App->>AuthSvc: updateAvatar(uid, "avatar_3")
    AuthSvc->>FS: updateDoc(users/{uid}, { avatarId: "avatar_3", avatarVariant: 1 })
    Store-->>App: avatarId atualizado
    App->>App: Redireciona → Home
```

---

## 3. Engine de Lição — Fluxo de Dados

```mermaid
sequenceDiagram
    actor U as 👤 Usuário
    participant Screen as "[lessonId].tsx"
    participant TrailSvc as trail.service.ts
    participant ProgressSvc as progress.service.ts
    participant FS as Firestore / Cache
    participant Store as Zustand Store

    U->>Screen: Abre lição (tap na trilha)

    Screen->>TrailSvc: getLesson(trailId, lessonId)
    TrailSvc->>FS: getDoc(trails/{trailId}/lessons/{lessonId})
    FS-->>TrailSvc: { title, xpReward, slides: [...] }
    TrailSvc-->>Screen: Lesson object

    Note over Screen: Renderiza slides sequencialmente

    loop Para cada slide
        Screen->>Screen: slideIndex++
        alt slide.type == "narrative"
            Screen->>Screen: Renderiza NarrativeSlide
        else slide.type == "decision"
            Screen->>Screen: Renderiza DecisionSlide
            U->>Screen: Seleciona uma opção (A, B ou C)
            Screen->>Screen: Armazena chosenOptionId
        else slide.type == "consequence"
            Screen->>Screen: Filtra consequence onde forOption == chosenOptionId
            Screen->>Screen: Renderiza ConsequenceSlide (positiva ou negativa)
        else slide.type == "xp_reward"
            Screen->>Screen: Calcula XP (100% se correto, 50% se errado)
            Screen->>Screen: Renderiza XPRewardSlide
        end
    end

    Note over Screen, Store: Lição concluída

    Screen->>ProgressSvc: completeLesson(uid, lessonId, xpEarned)
    ProgressSvc->>FS: setDoc(users/{uid}/progress/{lessonId}, { completed:true, xpEarned, completedAt })
    ProgressSvc->>FS: updateDoc(users/{uid}, { xp: novoXP })
    ProgressSvc-->>Store: addXP(xpEarned)

    Store->>Store: checkLevelUp(novoXP)
    alt Novo nível atingido
        Store->>FS: updateDoc(users/{uid}, { level: novoNivel, avatarVariant: novoNivel })
        Store-->>Screen: emit LevelUpEvent { oldLevel, newLevel }
        Screen->>Screen: Exibe LevelUpModal
    end

    Screen->>Screen: Volta para tela da Trilha
```

---

## 4. Sistema de XP e Progressão de Nível

```mermaid
stateDiagram-v2
    [*] --> Nivel1 : Cadastro (XP = 0)

    state "🟤 Nível 1 — Iniciante\n(0 XP)" as Nivel1
    state "🟢 Nível 2 — Aprendiz\n(150 XP)" as Nivel2
    state "🔵 Nível 3 — Consciente\n(350 XP)" as Nivel3
    state "🟣 Nível 4 — Estrategista\n(600 XP)" as Nivel4
    state "🟡 Nível 5 — Guardião Financeiro\n(900 XP)" as Nivel5

    Nivel1 --> Nivel2 : XP ≥ 150\nLevelUpModal exibido\navatarVariant → 2
    Nivel2 --> Nivel3 : XP ≥ 350\nLevelUpModal exibido\navatarVariant → 3
    Nivel3 --> Nivel4 : XP ≥ 600\nLevelUpModal exibido\navatarVariant → 4
    Nivel4 --> Nivel5 : XP ≥ 900\nLevelUpModal exibido\navatarVariant → 5
    Nivel5 --> Nivel5 : XP continua acumulando\n(sem cap — prepara v2)

    note right of Nivel1
        Avatar: roupa simples
    end note
    note right of Nivel2
        Avatar: +mochila/bolsa
    end note
    note right of Nivel3
        Avatar: roupa colorida
        expressão confiante
    end note
    note right of Nivel4
        Avatar: +óculos/relógio
    end note
    note right of Nivel5
        Avatar: visual completo
        badge dourado no perfil
    end note
```

---

## 5. Estratégia Offline — Árvore de Decisão

```mermaid
flowchart TD
    A([App abre]) --> B{Firebase Auth\ncache local\nválido?}

    B -->|Não| C[Tela de Login\nrequer internet]
    B -->|Sim| D[Usuário autenticado]

    D --> E{Conectado\nà internet?}

    E -->|Sim 🟢| F[Busca dados frescos\ndo Firestore]
    F --> G[Atualiza cache local\nautomaticamente]
    G --> H[Exibe app normalmente]

    E -->|Não 🔴| I{Cache do\nFirestore\nexiste?}

    I -->|Sim ✅| J[Carrega dados do cache]
    J --> K["Exibe banner:\n'Você está offline'\nProgresso será sincronizado"]
    K --> L[App funciona normalmente\ncom dados em cache]

    I -->|Não ❌| M["Exibe mensagem:\n'Conecte-se para\ncarregar o conteúdo'"]

    L --> N{Usuário conclui\numa lição?}
    N -->|Sim| O[Salva progresso\nno cache local]
    O --> P{Internet\nvoltou?}
    P -->|Sim| Q[Sincroniza progresso\ncom Firestore automático]
    P -->|Não| O

    style A fill:#1e293b,stroke:#3b82f6,color:#f1f5f9
    style H fill:#14532d,stroke:#22c55e,color:#f1f5f9
    style L fill:#14532d,stroke:#22c55e,color:#f1f5f9
    style M fill:#7f1d1d,stroke:#ef4444,color:#f1f5f9
    style C fill:#7f1d1d,stroke:#ef4444,color:#f1f5f9
    style Q fill:#14532d,stroke:#22c55e,color:#f1f5f9
```

---

## 6. Mapa de Telas e Navegação (Expo Router)

```mermaid
graph LR
    subgraph AUTH_GROUP["(auth) — sem bottom bar"]
        LOGIN["login.tsx\n📧 E-mail + Senha"]
        REGISTER["register.tsx\n📝 Cadastro"]
    end

    subgraph ONBOARDING["onboarding/"]
        AVATAR_SELECT["avatar-select.tsx\n🧑 Escolha de Avatar"]
    end

    subgraph APP_GROUP["(app) — com bottom bar"]
        HOME["index.tsx\n🏠 Home / Dashboard\n• XP Bar\n• Avatar atual\n• Card trilha ativa"]

        subgraph TRAILS_GROUP["trails/"]
            TRAIL_LIST["index.tsx\n📚 Lista de Trilhas\n• Golpes (ativo)\n• Outros (cadeado)"]
            TRAIL_DETAIL["[trailId].tsx\n📖 Detalhe da Trilha\n• Lista de lições\n• Progresso"]
            LESSON["lesson/[lessonId].tsx\n🎮 Engine de Lição\n• NarrativeSlide\n• DecisionSlide\n• ConsequenceSlide\n• XPRewardSlide"]
        end

        PROFILE["profile.tsx\n👤 Perfil\n• Avatar grande\n• XP total\n• Histórico"]
    end

    MODAL["LevelUpModal.tsx\n🎉 Level Up!\n• Avatar antes/depois\n• Nome do novo nível"]

    LOGIN -->|"Tem conta"| APP_GROUP
    LOGIN -->|"Criar conta"| REGISTER
    REGISTER -->|"Cadastro OK"| AVATAR_SELECT
    AVATAR_SELECT -->|"Avatar escolhido"| HOME
    HOME <-->|"bottom bar"| TRAIL_LIST
    HOME <-->|"bottom bar"| PROFILE
    TRAIL_LIST --> TRAIL_DETAIL
    TRAIL_DETAIL --> LESSON
    LESSON -.->|"Level Up event"| MODAL
    MODAL -.->|"dismiss"| TRAIL_DETAIL

    style AUTH_GROUP fill:#1e3a5f,stroke:#3b82f6,color:#f1f5f9
    style ONBOARDING fill:#3b1f5f,stroke:#a855f7,color:#f1f5f9
    style APP_GROUP fill:#1a3326,stroke:#22c55e,color:#f1f5f9
    style TRAILS_GROUP fill:#0f2218,stroke:#16a34a,color:#f1f5f9
    style MODAL fill:#451a03,stroke:#f97316,color:#f1f5f9
```

---

## 7. Modelo de Estado Global (Zustand)

```mermaid
classDiagram
    class UserStore {
        +uid: string | null
        +email: string | null
        +displayName: string | null
        +avatarId: string | null
        +avatarVariant: number
        +xp: number
        +level: number
        +isLoading: boolean
        +setUser(user) void
        +addXP(amount) LevelUpResult | null
        +updateAvatar(avatarId) void
        +logout() void
        -checkLevelUp(totalXP) number
    }

    class LevelUpResult {
        +previousLevel: number
        +newLevel: number
        +newAvatarVariant: number
        +levelName: string
    }

    class ProgressStore {
        +completedLessons: Map~lessonId, ProgressEntry~
        +markComplete(lessonId, xpEarned) void
        +isCompleted(lessonId) boolean
        +getTrailProgress(trailId) number
    }

    class ProgressEntry {
        +lessonId: string
        +xpEarned: number
        +completedAt: Date
    }

    UserStore --> LevelUpResult : "addXP() retorna"
    ProgressStore --> ProgressEntry : "armazena"
```

---

## 8. Camada de Serviços — Contratos de Interface

```typescript
// services/auth.service.ts
interface AuthService {
  register(name: string, email: string, password: string): Promise<string>; // retorna uid
  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  onAuthChange(callback: (user: User | null) => void): Unsubscribe;
}

// services/trail.service.ts
interface TrailService {
  getTrails(): Promise<Trail[]>;
  getLesson(trailId: string, lessonId: string): Promise<Lesson>;
  getLessonsForTrail(trailId: string): Promise<LessonSummary[]>;
}

// services/progress.service.ts
interface ProgressService {
  completeLesson(uid: string, lessonId: string, xpEarned: number): Promise<void>;
  getUserProgress(uid: string): Promise<Map<string, ProgressEntry>>;
  updateUserXPAndLevel(uid: string, newXP: number, newLevel: number, avatarVariant: number): Promise<void>;
}
```

---

> [!TIP]
> **Princípio de design:** Toda a lógica de negócio (cálculo de XP, verificação de level up, desbloqueio de lição) vive na **Zustand Store** e nos **Services** — as telas (`app/`) são puramente declarativas e não contêm lógica. Isso facilita testes unitários e manutenção futura.

> [!NOTE]
> **Sobre o Engine de Lição:** O componente `[lessonId].tsx` nunca "conhece" o conteúdo — ele apenas itera sobre o array `slides` retornado pelo Firestore e delega a renderização para o subcomponente correto baseado no campo `type`. Adicionar um novo tipo de slide (ex: `video`, `flashcard`) no futuro requer apenas um novo componente + suporte no switch, sem alterar a estrutura do banco.
