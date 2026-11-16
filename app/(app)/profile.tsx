// app/(app)/profile.tsx
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/useUserStore';
import { logout as logoutService } from '@/services/auth.service';
import { getLevelForXP, getNextLevel, levelProgress, LEVELS } from '@/constants/levels';
import { useAppTheme } from '@/constants/theme';
import { confirmAction } from '@/utils/alert';

const AVATAR_EMOJIS: Record<string, string> = {
  avatar_1: '🧑',
  avatar_2: '👩',
  avatar_3: '🧔',
  avatar_4: '👩‍🦱',
  avatar_5: '🧑‍🎓',
  avatar_6: '👩‍💼',
};

export default function ProfileScreen() {
  const { colors, fs, highContrast } = useAppTheme();
  const router = useRouter();
  const { displayName, email, xp, level, avatarId, completedLessons, logout } = useUserStore();

  const currentLevel = getLevelForXP(xp);
  const nextLevel = getNextLevel(level);
  const progress = levelProgress(xp);
  const avatarEmoji = avatarId ? (AVATAR_EMOJIS[avatarId] ?? '🧑') : '🧑';

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
        <Text style={{ color: colors.text, fontSize: fs(28), fontWeight: 'bold', marginBottom: 24 }}>
          Meu Perfil 👤
        </Text>

        {/* Card Principal de Perfil */}
        <View style={{
          backgroundColor: colors.surface,
          ...(highContrast && { borderWidth: 1, borderColor: colors.border }),
          borderRadius: 24,
          padding: 24,
          alignItems: 'center',
          marginBottom: 24,
          borderWidth: 1,
          borderColor: colors.border,
        }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.background,
            borderWidth: 3,
            borderColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: fs(40) }}>{avatarEmoji}</Text>
          </View>

          <Text style={{ color: colors.text, fontSize: fs(20), fontWeight: 'bold', marginBottom: 4 }}>
            {displayName ?? 'Estudante'}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: fs(13), marginBottom: 16 }}>
            {email ?? ''}
          </Text>

          {/* Badges de Status */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{
              backgroundColor: colors.primarySoft,
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.primary,
            }}>
              <Text style={{ color: colors.primaryText, fontWeight: 'bold', fontSize: fs(13) }}>
                Nível {level} • {currentLevel.name}
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
        <Text style={{ color: colors.textSubtle, fontSize: fs(12), fontWeight: 'bold', marginBottom: 12 }}>
          ESTATÍSTICAS DO APRENDIZADO
        </Text>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          <View style={{
            flex: 1,
            backgroundColor: colors.surface,
            ...(highContrast && { borderWidth: 1, borderColor: colors.border }),
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}>
            <Text style={{ fontSize: fs(24), marginBottom: 4 }}>🎯</Text>
            <Text style={{ color: colors.text, fontSize: fs(22), fontWeight: 'bold' }}>
              {completedLessons.size}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: fs(12) }}>Lições Feitas</Text>
          </View>

          <View style={{
            flex: 1,
            backgroundColor: colors.surface,
            ...(highContrast && { borderWidth: 1, borderColor: colors.border }),
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}>
            <Text style={{ fontSize: fs(24), marginBottom: 4 }}>⚡</Text>
            <Text style={{ color: colors.text, fontSize: fs(22), fontWeight: 'bold' }}>
              {xp}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: fs(12) }}>Pontos de XP</Text>
          </View>
        </View>

        {/* Níveis de Conquista */}
        <Text style={{ color: colors.textSubtle, fontSize: fs(12), fontWeight: 'bold', marginBottom: 12 }}>
          JORNADA DE NÍVEIS
        </Text>

        <View style={{ backgroundColor: colors.surface, borderRadius: 20, padding: 16, marginBottom: 24, gap: 10, ...(highContrast && { borderWidth: 1, borderColor: colors.border }) }}>
          {LEVELS.map((lvl) => {
            const isUnlocked = level >= lvl.level;
            const isCurrent = level === lvl.level;

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
                <Text style={{ fontSize: fs(20), marginRight: 12 }}>
                  {isUnlocked ? '🌟' : '🔒'}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    color: isUnlocked ? colors.text : colors.textSubtle,
                    fontWeight: isCurrent ? 'bold' : 'normal',
                    fontSize: fs(14),
                  }}>
                    Nível {lvl.level}: {lvl.name}
                  </Text>
                  <Text style={{ color: colors.textSubtle, fontSize: fs(11) }}>
                    {lvl.xpRequired} XP necessários
                  </Text>
                </View>
                {isCurrent && (
                  <View style={{ backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                    <Text style={{ color: colors.onPrimary, fontSize: fs(10), fontWeight: 'bold' }}>ATUAL</Text>
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
            ...(highContrast && { borderWidth: 1, borderColor: colors.border }),
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
          <Text style={{ color: colors.primaryText, fontSize: fs(18) }}>›</Text>
        </TouchableOpacity>

        {/* Botão de Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: colors.dangerSoft,
            borderRadius: 14,
            padding: 16,
            alignItems: 'center',
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
