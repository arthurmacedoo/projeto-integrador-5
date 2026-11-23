// ──────────────────────────────────────────────────────────────
// app/(app)/index.tsx
// Home / Dashboard — avatar evoluído, XP bar, card de trilha ativa com progresso
// ──────────────────────────────────────────────────────────────
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useShallow } from 'zustand/react/shallow';
import { useUserStore } from '@/store/useUserStore';
import { getLevelForXP, getNextLevel, levelProgress, xpToNextLevel } from '@/constants/levels';
import { useAppTheme } from '@/constants/theme';
import { getAvatarEmoji, getAvatarEvolution } from '@/constants/avatars';
import { ALL_LESSONS } from '@/constants/lessons';

const TOTAL_MVP_LESSONS = Object.keys(ALL_LESSONS).length;

export default function HomeScreen() {
  const { colors, fs, highContrast } = useAppTheme();
  const router = useRouter();
  const { displayName, xp, level, avatarId, avatarVariant, completedCount } = useUserStore(
    useShallow((s) => ({
      displayName: s.displayName,
      xp: s.xp,
      level: s.level,
      avatarId: s.avatarId,
      avatarVariant: s.avatarVariant,
      completedCount: s.completedLessons.size,
    }))
  );
  const avatarEmoji = getAvatarEmoji(avatarId);
  const evolution = getAvatarEvolution(avatarVariant || level);

  const currentLevel = getLevelForXP(xp);
  const nextLevel = getNextLevel(currentLevel.level);
  const progress = levelProgress(xp);
  const toNext = xpToNextLevel(xp);
  const trailPercent = Math.min(100, Math.round((completedCount / TOTAL_MVP_LESSONS) * 100));

  // No alto contraste, todos os níveis usam o amarelo de destaque
  const levelColor = highContrast ? colors.primary : evolution.ringColor;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 24, paddingTop: 56 }}>

        {/* Header: saudação */}
        <Text style={{ color: colors.textMuted, fontSize: fs(14), marginBottom: 4 }}>
          Bem-vindo de volta 👋
        </Text>
        <Text
          accessibilityRole="header"
          style={{ color: colors.textStrong, fontSize: fs(24), fontWeight: 'bold', marginBottom: 24 }}
        >
          {displayName ?? 'Estudante'}
        </Text>

        {/* Card: Avatar + Evolução + XP */}
        <View style={{
          backgroundColor: colors.surface,
          ...(highContrast && { borderWidth: 1, borderColor: colors.border }),
          borderRadius: 20,
          padding: 20,
          marginBottom: 24,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View
              accessible
              accessibilityLabel={`Seu avatar, nível ${currentLevel.level}, ${currentLevel.name}`}
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: colors.background,
                borderWidth: 3,
                borderColor: levelColor,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}
            >
              <Text style={{ fontSize: fs(28) }} importantForAccessibility="no">{avatarEmoji}</Text>
              {/* Insígnia de evolução visual do avatar (avatarVariant 1–5) */}
              <View
                style={{
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  backgroundColor: colors.background,
                  borderWidth: 1.5,
                  borderColor: levelColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 13 }} importantForAccessibility="no">{evolution.badge}</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
                <View style={{
                  backgroundColor: colors.background,
                  borderWidth: 1,
                  borderColor: levelColor,
                  borderRadius: 8,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                }}>
                  <Text style={{ color: levelColor, fontWeight: 'bold', fontSize: fs(12) }}>
                    Nível {currentLevel.level}
                  </Text>
                </View>
                <Text style={{ color: colors.textMuted, fontSize: fs(13) }}>
                  {currentLevel.name}
                </Text>
              </View>
              <Text style={{ color: colors.textStrong, fontWeight: 'bold', fontSize: fs(16) }}>
                {xp} XP total
              </Text>
            </View>
          </View>

          {/* Barra de XP */}
          <View
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel={
              nextLevel
                ? `Progresso do nível: ${Math.round(progress * 100)} por cento, faltam ${toNext} XP para ${nextLevel.name}`
                : 'Nível máximo atingido'
            }
            style={{ marginBottom: 8 }}
          >
            <View style={{
              backgroundColor: colors.background,
              borderRadius: 99,
              height: 10,
              overflow: 'hidden',
              borderWidth: highContrast ? 1 : 0,
              borderColor: colors.border,
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
            <Text style={{ color: colors.textSubtle, fontSize: fs(13) }}>
              {toNext} XP para {nextLevel.name}
            </Text>
          ) : (
            <Text style={{ color: colors.warning, fontSize: fs(13), fontWeight: '600' }}>
              🏆 Nível máximo atingido!
            </Text>
          )}
        </View>

        {/* Card: Trilha Ativa (PRD E2.F1 — com % de conclusão e acesso direto) */}
        <Text
          accessibilityRole="header"
          aria-level={2}
          style={{ color: colors.textMuted, fontSize: fs(14), fontWeight: '600', marginBottom: 12 }}
        >
          Continue de onde parou
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(app)/trails/trail_golpes' as any)}
          accessibilityRole="button"
          accessibilityLabel={`Abrir trilha Golpes Pix e WhatsApp, ${completedCount} de ${TOTAL_MVP_LESSONS} lições concluídas`}
          style={{
            backgroundColor: colors.surfaceSelected,
            borderRadius: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.primary,
            marginBottom: 24,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: fs(28) }} importantForAccessibility="no">🛡️</Text>
            <View style={{
              backgroundColor: colors.background,
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderWidth: 1,
              borderColor: colors.primaryBorder,
            }}>
              <Text style={{ color: colors.primaryText, fontSize: fs(12), fontWeight: 'bold' }}>
                {completedCount}/{TOTAL_MVP_LESSONS} ({trailPercent}%)
              </Text>
            </View>
          </View>
          <Text style={{ color: colors.textStrong, fontWeight: 'bold', fontSize: fs(18), marginBottom: 4 }}>
            Golpes Pix e WhatsApp
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: fs(13), marginBottom: 12 }}>
            Aprenda a identificar e se proteger dos golpes mais comuns
          </Text>

          {/* Mini barra de progresso da trilha */}
          <View style={{
            backgroundColor: colors.background,
            borderRadius: 99,
            height: 6,
            overflow: 'hidden',
            marginBottom: 14,
            borderWidth: highContrast ? 1 : 0,
            borderColor: colors.border,
          }}>
            <View style={{
              width: `${trailPercent}%`,
              height: '100%',
              backgroundColor: colors.primary,
              borderRadius: 99,
            }} />
          </View>

          <View style={{
            backgroundColor: colors.primary,
            borderRadius: 10,
            paddingVertical: 12,
            alignItems: 'center',
          }}>
            <Text style={{ color: colors.onPrimary, fontWeight: 'bold', fontSize: fs(15) }}>
              {completedCount > 0 ? 'Continuar Trilha →' : 'Começar Agora →'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Trilhas em breve */}
        <Text
          accessibilityRole="header"
          aria-level={2}
          style={{ color: colors.textMuted, fontSize: fs(14), fontWeight: '600', marginBottom: 12 }}
        >
          Em breve
        </Text>
        {[
          { emoji: '💰', title: 'Orçamento Pessoal' },
          { emoji: '🚨', title: 'Reserva de Emergência' },
          { emoji: '📋', title: 'Formalização MEI' },
        ].map((t) => (
          <View
            key={t.title}
            accessible
            accessibilityLabel={`${t.title}, em breve`}
            style={{
              backgroundColor: colors.surface,
              ...(highContrast && { borderWidth: 1, borderColor: colors.border }),
              borderRadius: 14,
              padding: 16,
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: fs(22), marginRight: 12 }} importantForAccessibility="no">{t.emoji}</Text>
            <Text style={{ color: colors.textFaint, fontSize: fs(15), flex: 1 }}>{t.title}</Text>
            <Text style={{ marginLeft: 8, color: colors.textFaint, fontSize: fs(14) }} importantForAccessibility="no">🔒</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
