// ──────────────────────────────────────────────────────────────
// store/useUserStore.ts
// Estado global do usuário autenticado (Zustand)
// ──────────────────────────────────────────────────────────────
import { create } from 'zustand';
import type { User, LevelUpResult, ProgressEntry } from '@/types';
import { getLevelForXP, getNextLevel } from '@/constants/levels';
import {
  completeLesson,
  updateUserXPAndLevel,
} from '@/services/progress.service';

// ── Shape do store ─────────────────────────────────────────
interface UserState {
  // Dados do usuário
  uid: string | null;
  displayName: string | null;
  email: string | null;
  avatarId: string | null;
  avatarVariant: number;
  xp: number;
  level: number;
  isLoading: boolean;

  // Progresso por lição
  completedLessons: Map<string, ProgressEntry>;

  // Ações
  setUser: (user: Partial<User & { uid: string }>) => void;
  setLoading: (loading: boolean) => void;
  updateAvatar: (avatarId: string) => void;
  setProgress: (progress: Map<string, ProgressEntry>) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  getTrailProgress: (lessonIds: string[]) => number;

  /**
   * Registra conclusão de uma lição.
   * Calcula XP, detecta level up e persiste no Firestore.
   * Retorna LevelUpResult se houve subida de nível, null caso contrário.
   */
  finishLesson: (
    lessonId: string,
    baseXP: number,
    isCorrect: boolean
  ) => Promise<LevelUpResult | null>;

  logout: () => void;
}

// ── Store ──────────────────────────────────────────────────
export const useUserStore = create<UserState>((set, get) => ({
  // Estado inicial
  uid: null,
  displayName: null,
  email: null,
  avatarId: null,
  avatarVariant: 1,
  xp: 0,
  level: 1,
  isLoading: true,
  completedLessons: new Map(),

  // ── Ações ──────────────────────────────────────────────

  setUser: (user) =>
    set((state) => ({
      uid:           user.uid           ?? state.uid,
      displayName:   user.displayName   ?? state.displayName,
      email:         user.email         ?? state.email,
      avatarId:      user.avatarId      ?? state.avatarId,
      avatarVariant: user.avatarVariant ?? state.avatarVariant,
      xp:            user.xp            ?? state.xp,
      level:         user.level         ?? state.level,
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  updateAvatar: (avatarId) => set({ avatarId }),

  setProgress: (progress) => set({ completedLessons: progress }),

  isLessonCompleted: (lessonId) => {
    return get().completedLessons.has(lessonId);
  },

  getTrailProgress: (lessonIds) => {
    const { completedLessons } = get();
    if (lessonIds.length === 0) return 0;
    const done = lessonIds.filter((id) => completedLessons.has(id)).length;
    return done / lessonIds.length;
  },

  finishLesson: async (lessonId, baseXP, isCorrect) => {
    const { uid, xp, level, completedLessons } = get();
    if (!uid) return null;

    // Não concede XP novamente se já completou
    if (completedLessons.has(lessonId)) return null;

    // XP: 100% se acertou, 50% se errou
    const xpEarned = isCorrect ? baseXP : Math.floor(baseXP * 0.5);
    const newXP = xp + xpEarned;

    // Detecta level up
    const newLevelConfig = getLevelForXP(newXP);
    const didLevelUp = newLevelConfig.level > level;
    const levelUpResult: LevelUpResult | null = didLevelUp
      ? {
          previousLevel:    level,
          newLevel:         newLevelConfig.level,
          newAvatarVariant: newLevelConfig.avatarVariantUnlocked,
          levelName:        newLevelConfig.name,
        }
      : null;

    // Atualiza estado local imediatamente (otimista)
    const newEntry: ProgressEntry = {
      lessonId,
      completed: true,
      xpEarned,
      completedAt: new Date(),
    };
    const updatedLessons = new Map(completedLessons);
    updatedLessons.set(lessonId, newEntry);

    set({
      xp:            newXP,
      level:         newLevelConfig.level,
      avatarVariant: newLevelConfig.avatarVariantUnlocked,
      completedLessons: updatedLessons,
    });

    // Persiste no Firestore em background
    await Promise.all([
      completeLesson(uid, lessonId, xpEarned),
      updateUserXPAndLevel(
        uid,
        newXP,
        newLevelConfig.level,
        newLevelConfig.avatarVariantUnlocked
      ),
    ]);

    return levelUpResult;
  },

  logout: () =>
    set({
      uid:              null,
      displayName:      null,
      email:            null,
      avatarId:         null,
      avatarVariant:    1,
      xp:               0,
      level:            1,
      completedLessons: new Map(),
    }),
}));
