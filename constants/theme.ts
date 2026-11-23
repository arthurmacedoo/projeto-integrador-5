// ──────────────────────────────────────────────────────────────
// constants/theme.ts
// Paletas de cor + tamanhos de fonte que respeitam as preferências
// de acessibilidade do usuário (alto contraste e tamanho do texto).
//
// Cada cor do design original virou um "token" com nome. No modo normal o
// token tem exatamente a cor original; no alto contraste vira preto, branco
// ou amarelo. Assim as telas não usam mais cores escritas à mão.
// ──────────────────────────────────────────────────────────────
import { useCallback } from 'react';
import { useAccessibilityStore, FONT_SCALE_VALUES } from '@/store/useAccessibilityStore';

// Paleta padrão = design original do TchôEduca (tema escuro slate/azul)
export const defaultColors = {
  // Fundos
  background: '#0f172a',
  surface: '#1e293b',
  surfaceSoft: '#1e293b60',
  surfaceSelected: '#1e3a5f',
  overlay: 'rgba(15, 23, 42, 0.85)',
  border: '#334155',

  // Textos
  text: '#f8fafc',
  textStrong: '#f1f5f9',
  textMuted: '#94a3b8',
  textSoft: '#cbd5e1',
  // Originais #64748b e #475569 tinham contraste abaixo do WCAG AA (3,7:1 e 2,4:1).
  // Clareados para passar de 4,5:1 sobre TODOS os fundos do app (inclusive surface #1e293b).
  textSubtle: '#8b99af',
  textFaint: '#8b99af',

  // Marca / ações
  // primary (#2563eb) garante contraste 5,17:1 com onPrimary (#ffffff) — passa no WCAG AA.
  // Para texto/ícones azuis sobre fundo escuro, use sempre primaryText (#60a5fa, 5,75:1+).
  primary: '#2563eb',
  primaryText: '#60a5fa',
  primarySoft: '#3b82f620',
  primaryBorder: '#3b82f660',
  accentText: '#38bdf8',
  onPrimary: '#ffffff',

  // Estados
  success: '#4ade80',
  successBase: '#22c55e',
  // #047857 garante contraste 5,48:1 com onPrimary (#ffffff) no badge "Feito" (WCAG AA)
  successDeep: '#047857',
  successSoft: '#05966920',
  successSoftDeep: '#064e3b20',
  danger: '#f87171',
  dangerSoft: '#ef444420',
  dangerBorder: '#ef444450',
  warning: '#fbbf24',
  warningBase: '#f59e0b',
  warningSoft: '#f59e0b20',
};

export type ThemeColors = typeof defaultColors;

// Alto contraste: preto puro, branco puro e amarelo (contraste acima de 15:1).
// Fundos "suaves" (transparências) somem; as bordas passam a separar os blocos.
export const highContrastColors: ThemeColors = {
  background: '#000000',
  surface: '#000000',
  surfaceSoft: 'transparent',
  surfaceSelected: '#262600',
  overlay: 'rgba(0, 0, 0, 0.95)',
  border: '#ffffff',

  text: '#ffffff',
  textStrong: '#ffffff',
  textMuted: '#ffffff',
  textSoft: '#ffffff',
  textSubtle: '#ffffff',
  textFaint: '#ffffff',

  primary: '#ffd600',
  primaryText: '#ffd600',
  primarySoft: 'transparent',
  primaryBorder: '#ffd600',
  accentText: '#ffd600',
  onPrimary: '#000000',

  success: '#7cff7c',
  successBase: '#7cff7c',
  successDeep: '#7cff7c',
  successSoft: 'transparent',
  successSoftDeep: 'transparent',
  danger: '#ff8a80',
  dangerSoft: 'transparent',
  dangerBorder: '#ff8a80',
  warning: '#ffd600',
  warningBase: '#ffd600',
  warningSoft: 'transparent',
};

// Tamanhos base (sp) dos componentes de acessibilidade. O menor é 16 (PRD, seção 9).
export const BASE_FONT_SIZES = {
  caption: 16,
  body: 18,
  title: 22,
  heading: 28,
};

// Acima deste tamanho é emoji/decoração (avatar, troféu): não escala,
// para não estourar os círculos e cartões de tamanho fixo.
const DECORATIVE_FONT_SIZE = 32;

export function useAppTheme() {
  const highContrast = useAccessibilityStore((s) => s.highContrast);
  const fontScale = useAccessibilityStore((s) => s.fontScale);
  const scale = FONT_SCALE_VALUES[fontScale];

  /** Escala um tamanho de fonte (ou lineHeight) do design original. */
  const fs = useCallback(
    (size: number) => (size >= DECORATIVE_FONT_SIZE ? size : Math.round(size * scale)),
    [scale]
  );

  const fontSize = useCallback(
    (variant: keyof typeof BASE_FONT_SIZES) => Math.round(BASE_FONT_SIZES[variant] * scale),
    [scale]
  );

  return {
    colors: highContrast ? highContrastColors : defaultColors,
    highContrast,
    scale,
    fs,
    fontSize,
  };
}
