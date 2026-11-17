// ──────────────────────────────────────────────────────────────
// constants/avatars.ts
// Fonte única dos avatares (antes duplicada em Home, Perfil e Onboarding)
// ──────────────────────────────────────────────────────────────

export const AVATARS = [
  { id: 'avatar_1', emoji: '🧑', label: 'Lucas' },
  { id: 'avatar_2', emoji: '👩', label: 'Ana' },
  { id: 'avatar_3', emoji: '🧔', label: 'Carlos' },
  { id: 'avatar_4', emoji: '👩‍🦱', label: 'Maria' },
  { id: 'avatar_5', emoji: '🧑‍🎓', label: 'Pedro' },
  { id: 'avatar_6', emoji: '👩‍💼', label: 'Júlia' },
] as const;

const DEFAULT_AVATAR_EMOJI = '🧑';

const AVATAR_EMOJIS: Record<string, string> = Object.fromEntries(
  AVATARS.map((a) => [a.id, a.emoji])
);

/** Emoji do avatar escolhido (ou o padrão, se ainda não escolheu). */
export function getAvatarEmoji(avatarId: string | null | undefined): string {
  return (avatarId && AVATAR_EMOJIS[avatarId]) || DEFAULT_AVATAR_EMOJI;
}
