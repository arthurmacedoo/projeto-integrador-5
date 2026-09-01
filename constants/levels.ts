// ──────────────────────────────────────────────────────────────
// constants/levels.ts
// Tabela de níveis — fonte da verdade local (fallback se Firestore offline)
// Espelha a coleção config/levels no Firestore
// ──────────────────────────────────────────────────────────────
import type { LevelConfig } from '@/types';

export const LEVELS: LevelConfig[] = [
  {
    level: 1,
    name: 'Iniciante',
    xpRequired: 0,
    avatarVariantUnlocked: 1,
  },
  {
    level: 2,
    name: 'Aprendiz',
    xpRequired: 150,
    avatarVariantUnlocked: 2,
  },
  {
    level: 3,
    name: 'Consciente',
    xpRequired: 350,
    avatarVariantUnlocked: 3,
  },
  {
    level: 4,
    name: 'Estrategista',
    xpRequired: 600,
    avatarVariantUnlocked: 4,
  },
  {
    level: 5,
    name: 'Guardião Financeiro',
    xpRequired: 900,
    avatarVariantUnlocked: 5,
  },
];

/** Retorna o nível correspondente a um total de XP */
export function getLevelForXP(xp: number): LevelConfig {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.xpRequired) current = lvl;
    else break;
  }
  return current;
}

/** Retorna o próximo nível (ou null se já é o máximo) */
export function getNextLevel(currentLevel: number): LevelConfig | null {
  return LEVELS.find((l) => l.level === currentLevel + 1) ?? null;
}

/** XP necessário para o próximo nível (ou 0 se já é máximo) */
export function xpToNextLevel(xp: number): number {
  const current = getLevelForXP(xp);
  const next = getNextLevel(current.level);
  if (!next) return 0;
  return next.xpRequired - xp;
}

/** % de progresso dentro do nível atual (0–1) */
export function levelProgress(xp: number): number {
  const current = getLevelForXP(xp);
  const next = getNextLevel(current.level);
  if (!next) return 1;
  const range = next.xpRequired - current.xpRequired;
  const earned = xp - current.xpRequired;
  return Math.min(earned / range, 1);
}
