// ──────────────────────────────────────────────────────────────
// constants/avatars.ts
// Fonte única dos avatares e da evolução visual por nível (avatarVariant 1–5)
// ──────────────────────────────────────────────────────────────

export const AVATARS = [
  { id: 'avatar_1', emoji: '🧑', label: 'Lucas' },
  { id: 'avatar_2', emoji: '👩', label: 'Ana' },
  { id: 'avatar_3', emoji: '🧔', label: 'Carlos' },
  { id: 'avatar_4', emoji: '👩‍🦱', label: 'Maria' },
  { id: 'avatar_5', emoji: '🧑‍🎓', label: 'Pedro' },
  { id: 'avatar_6', emoji: '👩‍💼', label: 'Júlia' },
] as const;

export interface AvatarEvolution {
  variant: number;
  badge: string;       // acessório / insígnia desbloqueada no nível
  ringColor: string;   // cor do anel e badge (calibrada para WCAG AA sobre fundo escuro)
  title: string;
}

// Evolução visual por nível (variantes 1–5): usada na Home, no Perfil e no LevelUpModal
export const AVATAR_EVOLUTIONS: Record<number, AvatarEvolution> = {
  1: { variant: 1, badge: '🌱', ringColor: '#cbd5e1', title: 'Iniciante' },
  2: { variant: 2, badge: '🎒', ringColor: '#4ade80', title: 'Aprendiz' },
  3: { variant: 3, badge: '💡', ringColor: '#60a5fa', title: 'Consciente' },
  4: { variant: 4, badge: '🕶️', ringColor: '#c084fc', title: 'Estrategista' },
  5: { variant: 5, badge: '👑', ringColor: '#fbbf24', title: 'Guardião Financeiro' },
};

const DEFAULT_AVATAR_EMOJI = '🧑';

const AVATAR_EMOJIS: Record<string, string> = Object.fromEntries(
  AVATARS.map((a) => [a.id, a.emoji])
);

/** Emoji do avatar escolhido (ou o padrão, se ainda não escolheu). */
export function getAvatarEmoji(avatarId: string | null | undefined): string {
  return (avatarId && AVATAR_EMOJIS[avatarId]) || DEFAULT_AVATAR_EMOJI;
}

/** Dados de evolução visual do avatar para o nível/variante informado (1–5). */
export function getAvatarEvolution(levelOrVariant: number): AvatarEvolution {
  const clamped = Math.max(1, Math.min(5, Math.round(levelOrVariant || 1)));
  return AVATAR_EVOLUTIONS[clamped];
}
