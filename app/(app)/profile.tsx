// app/(app)/profile.tsx
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useShallow } from 'zustand/react/shallow';
import { useUserStore } from '@/store/useUserStore';
import { logout as logoutService } from '@/services/auth.service';
import { getLevelForXP, LEVELS } from '@/constants/levels';
import { useAppTheme } from '@/constants/theme';
import { getAvatarEmoji, getAvatarEvolution } from '@/constants/avatars';
import { ALL_LESSONS } from '@/constants/lessons';
import { confirmAction } from '@/utils/alert';

export default function ProfileScreen() {
  const { colors, fs, highContrast } = useAppTheme();
  const router = useRouter();
  const { displayName, email, xp, avatarId, avatarVariant, completedLessons, logout } = useUserStore(
    useShallow((s) => ({
      displayName: s.displayName,
      email: s.email,
      xp: s.xp,
      avatarId: s.avatarId,
      avatarVariant: s.avatarVariant,
      completedLessons: s.completedLessons,
      logout: s.logout,
    }))
  );

  const currentLevel = getLevelForXP(xp);
  const avatarEmoji = getAvatarEmoji(avatarId);
  const evolution = getAvatarEvolution(avatarVariant || currentLevel.level);
  const ringColor = highContrast ? colors.primary : evolution.ringColor;
  const completedCount = completedLessons.size;

  const completedHistory = Array.from(completedLessons.values()).sort(
    (a, b) => (ALL_LESSONS[a.lessonId]?.order ?? 99) - (ALL_LESSONS[b.lessonId]?.order ?? 99)
  );

  async function handleLogout() {
    confirmAction('Sair da Conta', 'Deseja realmente sair do aplicativo?', 'Sair', async () => {
      try {
        await logoutService();
        logout();
      } catch (err) {
        console.error('Erro ao deslogar:', err);
      }
    });
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 24, paddingTop: 56 }}>
        <Text
          accessibilityRole="header"
          style={{ color: colors.text, fontSize: fs(28), fontWeight: 'bold', marginBottom: 24 }}
        >
          Meu Perfil 👤
        </Text>

        {/* Card Principal de Perfil */}
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: 24,
          padding: 24,
          alignItems: 'center',
          marginBottom: 24,
          borderWidth: 1,
          borderColor: colors.border,
        }}>
          <View
            accessible
            accessibilityLabel={`Avatar nível ${currentLevel.level}, ${currentLevel.name}`}
            style={{
              width: 84,
              height: 84,
              borderRadius: 42,
              backgroundColor: colors.background,
              borderWidth: 3,
              borderColor: ringColor,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: fs(40) }} importantForAccessibility="no">{avatarEmoji}</Text>
            <View
              style={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: colors.background,
                borderWidth: 2,
                borderColor: ringColor,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 15 }} importantForAccessibility="no">{evolution.badge}</Text>
            </View>
          </View>

          <Text style={{ color: colors.text, fontSize: fs(20), fontWeight: 'bold', marginBottom: 4 }}>
            {displayName ?? 'Estudante'}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: fs(13), marginBottom: 16 }}>
            {email ?? ''}
          </Text>

          {/* Badges de Status */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
            <View style={{
              backgroundColor: colors.primarySoft,
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.primary,
            }}>
              <Text style={{ color: colors.primaryText, fontWeight: 'bold', fontSize: fs(13) }}>
                Nível {currentLevel.level} • {currentLevel.name}
              </Text>
            </View>
            <View style={{
              backgroundColor: colors.warningSoft,
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.warningBase,
            }}>
              <Text style={{ color: colors.warning, fontWeight: 'bold', fontSize: fs(13) }}>
                {xp} XP
              </Text>
            </View>
          </View>
        </View>

        {/* Estatísticas */}
        <Text
          accessibilityRole="header"
          aria-level={2}
          style={{ color: colors.textSubtle, fontSize: fs(12), fontWeight: 'bold', marginBottom: 12 }}
        >
          ESTATÍSTICAS DO APRENDIZADO
        </Text>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          <View style={{
            flex: 1,
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}>
            <Text style={{ fontSize: fs(24), marginBottom: 4 }} importantForAccessibility="no">🎯</Text>
            <Text style={{ color: colors.text, fontSize: fs(22), fontWeight: 'bold' }}>
              {completedCount}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: fs(12) }}>Lições Feitas</Text>
          </View>

          <View style={{
            flex: 1,
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}>
            <Text style={{ fontSize: fs(24), marginBottom: 4 }} importantForAccessibility="no">⚡</Text>
            <Text style={{ color: colors.text, fontSize: fs(22), fontWeight: 'bold' }}>
              {xp}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: fs(12) }}>Pontos de XP</Text>
          </View>
        </View>

        {/* Histórico de Lições Concluídas (PRD E2.F2) */}
        {completedHistory.length > 0 && (
          <>
            <Text
              accessibilityRole="header"
              aria-level={2}
              style={{ color: colors.textSubtle, fontSize: fs(12), fontWeight: 'bold', marginBottom: 12 }}
            >
              LIÇÕES CONCLUÍDAS
            </Text>
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 20,
                padding: 16,
                marginBottom: 24,
                gap: 10,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              {completedHistory.map((entry) => {
                const info = ALL_LESSONS[entry.lessonId];
                return (
                  <View
                    key={entry.lessonId}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                    }}
                  >
                    <Text style={{ color: colors.text, fontSize: fs(14), flex: 1 }}>
                      ✅ {info?.title ?? entry.lessonId}
                    </Text>
                    <Text style={{ color: colors.warning, fontSize: fs(13), fontWeight: 'bold' }}>
                      +{entry.xpEarned} XP
                    </Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Níveis de Conquista */}
        <Text
          accessibilityRole="header"
          aria-level={2}
          style={{ color: colors.textSubtle, fontSize: fs(12), fontWeight: 'bold', marginBottom: 12 }}
        >
          JORNADA DE NÍVEIS
        </Text>

        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 16,
            marginBottom: 24,
            gap: 10,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          {LEVELS.map((lvl) => {
            const isUnlocked = currentLevel.level >= lvl.level;
            const isCurrent = currentLevel.level === lvl.level;
            const evo = getAvatarEvolution(lvl.level);

            return (
              <View
                key={lvl.level}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                  backgroundColor: isCurrent ? colors.background : 'transparent',
                  borderRadius: 12,
                  borderWidth: isCurrent ? 1 : 0,
                  borderColor: colors.primary,
                }}
              >
                <Text style={{ fontSize: fs(20), marginRight: 12 }} importantForAccessibility="no">
                  {isUnlocked ? evo.badge : '🔒'}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    color: isUnlocked ? colors.text : colors.textSubtle,
                    fontWeight: isCurrent ? 'bold' : 'normal',
                    fontSize: fs(14),
                  }}>
                    Nível {lvl.level}: {lvl.name}
                  </Text>
                  <Text style={{ color: colors.textSubtle, fontSize: fs(12) }}>
                    {lvl.xpRequired} XP necessários
                  </Text>
                </View>
                {isCurrent && (
                  <View style={{ backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                    <Text style={{ color: colors.onPrimary, fontSize: fs(11), fontWeight: 'bold' }}>ATUAL</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Botão de Acessibilidade */}
        <TouchableOpacity
          onPress={() => router.push('/accessibility')}
          accessibilityRole="button"
          accessibilityLabel="Abrir configurações de acessibilidade"
          style={{
            backgroundColor: colors.surface,
            borderRadius: 14,
            padding: 16,
            minHeight: 56,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.primary,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: fs(22), marginRight: 12 }} importantForAccessibility="no">♿</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: fs(16) }}>Acessibilidade</Text>
            <Text style={{ color: colors.textMuted, fontSize: fs(13) }}>Tamanho do texto, alto contraste e leitura em voz alta</Text>
          </View>
          <Text style={{ color: colors.primaryText, fontSize: fs(18) }} importantForAccessibility="no">›</Text>
        </TouchableOpacity>

        {/* Botão de Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel="Sair da conta"
          style={{
            backgroundColor: colors.dangerSoft,
            borderRadius: 14,
            padding: 16,
            minHeight: 52,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.dangerBorder,
            marginBottom: 32,
          }}
        >
          <Text style={{ color: colors.danger, fontWeight: 'bold', fontSize: fs(15) }}>
            Sair da Conta 🚪
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
