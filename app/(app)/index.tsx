// ──────────────────────────────────────────────────────────────
// app/(app)/index.tsx
// Home / Dashboard — avatar, XP bar, card de trilha ativa
// ──────────────────────────────────────────────────────────────
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useShallow } from 'zustand/react/shallow';
import { useUserStore } from '@/store/useUserStore';
import { getLevelForXP, getNextLevel, levelProgress, xpToNextLevel } from '@/constants/levels';
import { useAppTheme } from '@/constants/theme';
import { getAvatarEmoji } from '@/constants/avatars';

// Cor por nível (constante fora do componente: não é recriada a cada render)
// (Nível 1 era #78716c — clareado para #a8a29e para passar no contraste WCAG AA)
const LEVEL_COLORS: Record<number, string> = {
  1: '#a8a29e', 2: '#22c55e', 3: '#3b82f6', 4: '#a855f7', 5: '#f59e0b',
};

export default function HomeScreen() {
  const { colors, fs, highContrast } = useAppTheme();
  const router = useRouter();
  // Seletor com useShallow: a Home só re-renderiza quando estes campos mudam
  const { displayName, xp, level, avatarId } = useUserStore(
    useShallow((s) => ({ displayName: s.displayName, xp: s.xp, level: s.level, avatarId: s.avatarId }))
  );
  const avatarEmoji = getAvatarEmoji(avatarId);

  const currentLevel = getLevelForXP(xp);
  const nextLevel = getNextLevel(level);
  const progress = levelProgress(xp);
  const toNext = xpToNextLevel(xp);

  // No alto contraste, todos os níveis usam o amarelo de destaque
  const levelColor = highContrast ? colors.primary : (LEVEL_COLORS[level] ?? '#3b82f6');

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 24, paddingTop: 56 }}>

        {/* Header: saudação */}
        <Text style={{ color: colors.textMuted, fontSize: fs(14), marginBottom: 4 }}>
          Bem-vindo de volta 👋
        </Text>
        <Text style={{ color: colors.textStrong, fontSize: fs(24), fontWeight: 'bold', marginBottom: 24 }}>
          {displayName ?? 'Estudante'}
        </Text>

        {/* Card: Avatar + XP */}
        <View style={{
          backgroundColor: colors.surface,
          ...(highContrast && { borderWidth: 1, borderColor: colors.border }),
          borderRadius: 20,
          padding: 20,
          marginBottom: 24,
        }}>
          {/* Avatar placeholder */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: colors.background,
              borderWidth: 3,
              borderColor: levelColor,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
            }}>
              <Text style={{ fontSize: fs(28) }}>{avatarEmoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <View style={{
                  backgroundColor: highContrast ? 'transparent' : levelColor + '30',
                  borderWidth: highContrast ? 1 : 0,
                  borderColor: levelColor,
                  borderRadius: 8,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  marginRight: 8,
                }}>
                  <Text style={{ color: levelColor, fontWeight: 'bold', fontSize: fs(11) }}>
                    Nível {level}
                  </Text>
                </View>
                <Text style={{ color: colors.textMuted, fontSize: fs(12) }}>
                  {currentLevel.name}
                </Text>
              </View>
              <Text style={{ color: colors.textStrong, fontWeight: 'bold', fontSize: fs(16) }}>
                {xp} XP total
              </Text>
            </View>
          </View>

          {/* Barra de XP */}
          <View style={{ marginBottom: 8 }}>
            <View style={{
              backgroundColor: colors.background,
              borderRadius: 99,
              height: 10,
              overflow: 'hidden',
            }}>
              <View style={{
                width: `${Math.round(progress * 100)}%`,
                height: '100%',
                backgroundColor: levelColor,
                borderRadius: 99,
              }} />
            </View>
          </View>
          {nextLevel ? (
            <Text style={{ color: colors.textSubtle, fontSize: fs(12) }}>
              {toNext} XP para {nextLevel.name}
            </Text>
          ) : (
            <Text style={{ color: colors.warningBase, fontSize: fs(12) }}>
              🏆 Nível máximo atingido!
            </Text>
          )}
        </View>

        {/* Card: Trilha Ativa */}
        <Text style={{ color: colors.textMuted, fontSize: fs(14), fontWeight: '600', marginBottom: 12 }}>
          Continue de onde parou
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(app)/trails')}
          style={{
            backgroundColor: colors.surfaceSelected,
            borderRadius: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.primary,
            marginBottom: 24,
          }}
        >
          <Text style={{ fontSize: fs(28), marginBottom: 8 }}>🛡️</Text>
          <Text style={{ color: colors.textStrong, fontWeight: 'bold', fontSize: fs(18), marginBottom: 4 }}>
            Golpes Pix e WhatsApp
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: fs(13), marginBottom: 12 }}>
            Aprenda a identificar e se proteger dos golpes mais comuns
          </Text>
          <View style={{
            backgroundColor: colors.primary,
            borderRadius: 10,
            paddingVertical: 10,
            alignItems: 'center',
          }}>
            <Text style={{ color: colors.onPrimary, fontWeight: 'bold', fontSize: fs(15) }}>Continuar →</Text>
          </View>
        </TouchableOpacity>

        {/* Trilhas em breve */}
        <Text style={{ color: colors.textMuted, fontSize: fs(14), fontWeight: '600', marginBottom: 12 }}>
          Em breve
        </Text>
        {['💰 Orçamento Pessoal', '🚨 Reserva de Emergência', '📋 Formalização MEI'].map((t) => (
          <View key={t} style={{
            backgroundColor: colors.surface,
            ...(highContrast && { borderWidth: 1, borderColor: colors.border }),
            borderRadius: 14,
            padding: 16,
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: fs(22), marginRight: 12 }}>{t.split(' ')[0]}</Text>
            <Text style={{ color: colors.textFaint, fontSize: fs(15) }}>{t.substring(3)}</Text>
            <Text style={{ marginLeft: 'auto', color: colors.textFaint, fontSize: fs(12) }}>🔒</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
