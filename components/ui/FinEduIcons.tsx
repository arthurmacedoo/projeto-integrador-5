// ──────────────────────────────────────────────────────────────
// components/ui/FinEduIcons.tsx
// Ícones vetoriais SVG e Ilustrações Flat dos Avatares do PDF FinEdu
// ──────────────────────────────────────────────────────────────
import React from 'react';
import { View, Text } from 'react-native';

const Svg = 'svg' as any;
const Path = 'path' as any;
const Circle = 'circle' as any;
const Rect = 'rect' as any;
const Line = 'line' as any;
const Polyline = 'polyline' as any;
const G = 'g' as any;
const Ellipse = 'ellipse' as any;

// ── 1. LOGO FINEDU ( Quadrado verde escuro + livro/broto + texto ) ──
export function FinEduBrand({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const boxSize = size === 'sm' ? 28 : 32;
  const iconSize = size === 'sm' ? 16 : 18;
  return (
    <View className="flex-row items-center">
      <View
        style={{ width: boxSize, height: boxSize, borderRadius: 9, backgroundColor: '#1A4731' }}
        className="items-center justify-center mr-2.5"
      >
        <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <Path
            d="M2 6s3-2 10-2 10 2 10 2v14s-3-2-10-2-10 2-10 2V6z"
            stroke="#D9ECAE"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M12 4v16"
            stroke="#D9ECAE"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
      </View>
      <Text
        style={{ color: '#1A4731', fontSize: size === 'sm' ? 18 : 20, fontWeight: '800' }}
      >
        FinEdu
      </Text>
    </View>
  );
}

// ── 2. ÍCONES DE LINHA (SVG) ───────────────────────────────────
export function IconSprout({ size = 20, color = '#1A4731' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 20h10M12 20v-8M12 12C12 7 17 5 19 5c0 5-3 7-7 7zM12 14c0-4-4-6-7-6 0 4 3 6 7 6z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconEye({ off = false, size = 18, color = '#78716C' }: { off?: boolean; size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" />
      {off && <Line x1="4" y1="4" x2="20" y2="20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />}
    </Svg>
  );
}

export function IconWifiOff({ size = 16, color = '#78716C' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="2" y1="2" x2="22" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M8.5 16.5a5 5 0 0 1 7 0" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M5 12.5a10 10 0 0 1 14 0" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Circle cx="12" cy="20" r="1" fill={color} />
    </Svg>
  );
}

export function IconClock({ size = 14, color = '#1A4731' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      <Polyline points="12 7 12 12 15 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconSparkle({ size = 14, color = '#1A4731' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2L12 3z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconShieldOutline({ size = 18, color = '#1A4731' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Polyline points="9 12 11 14 15 10" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconLock({ size = 16, color = '#8C887E' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth="1.8" />
      <Path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function IconCheck({ size = 14, color = '#1A4731' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polyline points="20 6 9 17 4 12" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconCheckCircle({ size = 16, color = '#1A4731' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
      <Polyline points="16 9 10.5 14.5 8 12" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconInfoCircle({ size = 16, color = '#78716C' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
      <Line x1="12" y1="16" x2="12" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Circle cx="12" cy="8.5" r="1" fill={color} />
    </Svg>
  );
}

export function IconBudget({ size = 18, color = '#57534E' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="4" width="16" height="16" rx="3" stroke={color} strokeWidth="1.8" />
      <Line x1="8" y1="9" x2="16" y2="9" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="8" y1="13" x2="13" y2="13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function IconUmbrella({ size = 18, color = '#57534E' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M22 12a10 10 0 0 0-20 0h20z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <Path d="M12 12v6a2 2 0 0 0 4 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function IconStore({ size = 18, color = '#57534E' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9l2-5h14l2 5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M5 9v10h14V9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Rect x="9" y="13" width="6" height="6" stroke={color} strokeWidth="1.8" />
    </Svg>
  );
}

export function IconEarbuds({ size = 22, color = '#78716C' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="5" width="5" height="8" rx="2.5" stroke={color} strokeWidth="1.8" />
      <Path d="M7.5 13v5a1.5 1.5 0 0 1-3 0v-2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Rect x="14" y="5" width="5" height="8" rx="2.5" stroke={color} strokeWidth="1.8" />
      <Path d="M16.5 13v5a1.5 1.5 0 0 0 3 0v-2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function IconLightbulb({ size = 16, color = '#1A4731' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconBackpack({ size = 16, color = '#1A4731' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="6" y="7" width="12" height="14" rx="3" stroke={color} strokeWidth="1.8" />
      <Path d="M9 7V5a3 3 0 0 1 6 0v2" stroke={color} strokeWidth="1.8" />
      <Line x1="9" y1="13" x2="15" y2="13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function IconShirt({ size = 16, color = '#57534E' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 4l-5 3 2 4 3-1v10h8V10l3 1 2-4-5-3-2 2h-4L8 4z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconGlasses({ size = 16, color = '#57534E' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="6.5" cy="14.5" r="3.5" stroke={color} strokeWidth="1.8" />
      <Circle cx="17.5" cy="14.5" r="3.5" stroke={color} strokeWidth="1.8" />
      <Path d="M10 14.5h4M3 14l2-6M21 14l-2-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function IconMedal({ size = 16, color = '#B45309' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="14" r="6" stroke={color} strokeWidth="1.8" />
      <Path d="M9 4l3 4 3-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconLogout({ size = 16, color = '#1A4731' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Polyline points="16 17 21 12 16 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="21" y1="12" x2="9" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

// ── 3. ÍCONES DA BOTTOM TAB BAR (Início, Trilhas, Perfil) ──────
export function TabBarIconHome({ color = '#1A4731' }: { color?: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function TabBarIconTrails({ color = '#1A4731' }: { color?: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="6" cy="6" r="2.5" stroke={color} strokeWidth="2" />
      <Circle cx="18" cy="18" r="2.5" stroke={color} strokeWidth="2" />
      <Path
        d="M8.5 6H15a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h6.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function TabBarIconProfile({ color = '#1A4731' }: { color?: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" />
      <Path d="M5 20a7 7 0 0 1 14 0" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

// ── 4. RETRATOS FLAT-VECTOR DOS AVATARES (Lia, Caio, Bia, Ravi, Iara, Alex, João) ──
export function AvatarPortrait({
  id = 'avatar_1',
  size = 64,
  evolved = false,
}: {
  id?: string | null;
  size?: number;
  evolved?: boolean;
}) {
  const configs: Record<
    string,
    {
      bg: string;
      skin: string;
      hair: string;
      shirt: string;
      hairStyle: 'puffs' | 'short' | 'wavy' | 'beard' | 'long' | 'glasses';
    }
  > = {
    avatar_1: {
      // Lia
      bg: evolved ? '#DCECC1' : '#EFECE4',
      skin: '#C68B59',
      hair: '#2B1E1A',
      shirt: '#1A4731',
      hairStyle: 'puffs',
    },
    avatar_2: {
      // Caio
      bg: '#EFECE4',
      skin: '#8D5524',
      hair: '#1E1916',
      shirt: '#6B2D26',
      hairStyle: 'short',
    },
    avatar_3: {
      // Bia
      bg: '#EFECE4',
      skin: '#F1C27D',
      hair: '#9C4221',
      shirt: '#C05621',
      hairStyle: 'wavy',
    },
    avatar_4: {
      // Ravi
      bg: '#EFECE4',
      skin: '#B87B4C',
      hair: '#231F20',
      shirt: '#2C4A52',
      hairStyle: 'beard',
    },
    avatar_5: {
      // Iara
      bg: '#EFECE4',
      skin: '#C58C66',
      hair: '#1A1817',
      shirt: '#1E4631',
      hairStyle: 'long',
    },
    avatar_6: {
      // Alex
      bg: '#EFECE4',
      skin: '#D9A17C',
      hair: '#4A3222',
      shirt: '#B7791F',
      hairStyle: 'glasses',
    },
    joao: {
      bg: '#DCECC1',
      skin: '#B97A4B',
      hair: '#231B18',
      shirt: '#1A4731',
      hairStyle: 'short',
    },
  };

  const c = configs[id ?? 'avatar_1'] ?? configs.avatar_1;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
        backgroundColor: c.bg,
      }}
      className="items-center justify-center"
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="50" fill={c.bg} />

        {/* Mochila se evoluído (Aprendiz+) */}
        {evolved && (
          <Rect x="22" y="56" width="56" height="36" rx="12" fill="#8C6D3F" />
        )}

        {/* Cabelo de fundo */}
        {c.hairStyle === 'puffs' && (
          <G>
            <Circle cx="26" cy="36" r="14" fill={c.hair} />
            <Circle cx="74" cy="36" r="14" fill={c.hair} />
          </G>
        )}
        {c.hairStyle === 'wavy' && (
          <Path d="M24 45 C22 72, 78 72, 76 45 Z" fill={c.hair} />
        )}
        {c.hairStyle === 'long' && (
          <Rect x="26" y="32" width="48" height="50" rx="18" fill={c.hair} />
        )}

        {/* Camiseta / Ombros */}
        <Path d="M18 100 C18 72, 82 72, 82 100 Z" fill={c.shirt} />

        {/* Alças da mochila sobre a camiseta */}
        {evolved && (
          <G>
            <Rect x="28" y="75" width="7" height="25" rx="3" fill="#6E522B" />
            <Rect x="65" y="75" width="7" height="25" rx="3" fill="#6E522B" />
          </G>
        )}

        {/* Pescoço */}
        <Rect x="43" y="60" width="14" height="18" rx="6" fill={c.skin} />

        {/* Rosto */}
        <Ellipse cx="50" cy="46" rx="20" ry="22" fill={c.skin} />

        {/* Cabelo Frontal / Topo */}
        <Path
          d="M30 42 C30 22, 70 22, 70 42 C62 32, 38 32, 30 42 Z"
          fill={c.hair}
        />

        {/* Barba para Ravi */}
        {c.hairStyle === 'beard' && (
          <Path
            d="M32 50 C32 68, 68 68, 68 50 C63 58, 37 58, 32 50 Z"
            fill={c.hair}
            opacity="0.85"
          />
        )}

        {/* Olhos */}
        <Circle cx="43" cy="46" r="2.2" fill="#1C1917" />
        <Circle cx="57" cy="46" r="2.2" fill="#1C1917" />

        {/* Óculos para Alex */}
        {c.hairStyle === 'glasses' && (
          <G>
            <Circle cx="43" cy="46" r="5.5" stroke="#2D2520" strokeWidth="1.8" fill="none" />
            <Circle cx="57" cy="46" r="5.5" stroke="#2D2520" strokeWidth="1.8" fill="none" />
            <Line x1="48.5" y1="46" x2="51.5" y2="46" stroke="#2D2520" strokeWidth="1.8" />
          </G>
        )}

        {/* Sorriso */}
        <Path
          d="M44 54 Q50 59 56 54"
          stroke="#1C1917"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

// ── 5. ILUSTRAÇÃO DO ESCUDO DUOTONE (Telas 3, 8, 12, 14) ──────
export function ShieldHeroIllustration({
  variant = 'check',
  compact = false,
}: {
  variant?: 'check' | 'star';
  compact?: boolean;
}) {
  const outerSize = compact ? 110 : 148;
  const innerSize = compact ? 82 : 112;
  const svgSize = compact ? 54 : 72;

  return (
    <View className="items-center justify-center relative py-2">
      {/* Decorações sutis ao redor */}
      <View
        style={{ top: 6, right: -16 }}
        className="absolute"
      >
        <Text style={{ color: '#4D6B53', fontSize: 18, fontWeight: '400' }}>+</Text>
      </View>
      <View
        style={{ top: 18, left: -14, width: 8, height: 8, borderRadius: 4, backgroundColor: '#1A4731' }}
        className="absolute"
      />
      <View
        style={{ bottom: 14, right: -10, width: 6, height: 6, borderRadius: 3, backgroundColor: '#C5D89D' }}
        className="absolute"
      />

      {/* Círculo externo verde-lima suave */}
      <View
        style={{
          width: outerSize,
          height: outerSize,
          borderRadius: outerSize / 2,
          backgroundColor: '#E5EFCE',
        }}
        className="items-center justify-center"
      >
        {/* Círculo interno verde-lima */}
        <View
          style={{
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            backgroundColor: '#D5E8B0',
          }}
          className="items-center justify-center"
        >
          <Svg width={svgSize} height={svgSize} viewBox="0 0 64 64" fill="none">
            {/* Escudo Inteiro */}
            <Path
              d="M32 6L10 15v17c0 15.5 9.4 25.4 22 29 12.6-3.6 22-13.5 22-29V15L32 6z"
              fill="#1A4731"
            />
            {/* Metade direita sutilmente mais clara */}
            <Path
              d="M32 6v55c12.6-3.6 22-13.5 22-29V15L32 6z"
              fill="#23573D"
            />
            {variant === 'check' ? (
              <Polyline
                points="22 33 29 40 43 25"
                stroke="#D9ECAE"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <Path
                d="M32 19l3.8 7.7 8.5 1.2-6.1 6 1.4 8.5L32 38.4l-7.6 4 1.4-8.5-6.1-6 8.5-1.2L32 19z"
                stroke="#D9ECAE"
                strokeWidth="3"
                strokeLinejoin="round"
              />
            )}
          </Svg>
        </View>
      </View>
    </View>
  );
}
