// ──────────────────────────────────────────────────────────────
// TIPOS CENTRAIS DO FINEDU APP
// Refletem a estrutura de documentos do Firestore
// ──────────────────────────────────────────────────────────────

// ── Firestore: users/{uid} ──────────────────────────────────
export interface User {
  uid: string;
  displayName: string;
  email: string;
  avatarId: string | null;       // ex: "avatar_1" … "avatar_6"
  avatarVariant: number;         // 1–5, evolui com o nível
  xp: number;
  level: number;
  createdAt: Date;
}

// ── Firestore: users/{uid}/progress/{lessonId} ──────────────
export interface ProgressEntry {
  lessonId: string;
  completed: boolean;
  xpEarned: number;
  completedAt: Date;
}

// ── Firestore: trails/{trailId} ────────────────────────────
export interface Trail {
  id: string;
  title: string;
  description: string;
  order: number;
  isLocked: boolean;
  iconName: string;              // nome de ícone (ex: "shield-alert")
  color: string;                 // cor temática da trilha
}

// ── Firestore: trails/{trailId}/lessons/{lessonId} ─────────
export interface Lesson {
  id: string;
  trailId: string;
  title: string;
  order: number;
  xpReward: number;
  slides: Slide[];
}

export interface LessonSummary {
  id: string;
  title: string;
  order: number;
  xpReward: number;
}

// ── Tipos de Slide (Engine de Lição) ───────────────────────
export type SlideType = 'narrative' | 'decision' | 'consequence' | 'xp_reward';

export interface BaseSlide {
  type: SlideType;
}

export interface NarrativeSlide extends BaseSlide {
  type: 'narrative';
  character: string;             // ex: "joao", "dona_cida", "narrator"
  text: string;
  background?: string;           // ex: "phone_screen", "street"
}

export interface DecisionOption {
  id: string;                    // "A", "B", "C"
  text: string;
  isCorrect: boolean;
}

export interface DecisionSlide extends BaseSlide {
  type: 'decision';
  question: string;
  options: DecisionOption[];
}

export interface ConsequenceSlide extends BaseSlide {
  type: 'consequence';
  forOption: string;             // "A", "B" ou "C"
  isNegative: boolean;
  text: string;
  tip: string;
}

export interface XPRewardSlide extends BaseSlide {
  type: 'xp_reward';
  // XP calculado dinamicamente com base em isCorrect
}

export type Slide =
  | NarrativeSlide
  | DecisionSlide
  | ConsequenceSlide
  | XPRewardSlide;

// ── Gamificação ────────────────────────────────────────────
export interface LevelConfig {
  level: number;
  name: string;
  xpRequired: number;
  avatarVariantUnlocked: number;
}

export interface LevelUpResult {
  previousLevel: number;
  newLevel: number;
  newAvatarVariant: number;
  levelName: string;
}

// ── Navegação ──────────────────────────────────────────────
export type RootStackParamList = {
  '(auth)/login': undefined;
  '(auth)/register': undefined;
  'onboarding/avatar-select': undefined;
  '(app)/index': undefined;
  '(app)/trails/index': undefined;
  '(app)/trails/[trailId]': { trailId: string };
  '(app)/trails/lesson/[lessonId]': { trailId: string; lessonId: string };
  '(app)/profile': undefined;
};
