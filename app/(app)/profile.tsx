// app/(app)/profile.tsx
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useUserStore } from '@/store/useUserStore';
import { logout as logoutService } from '@/services/auth.service';
import { getLevelForXP, getNextLevel, levelProgress, LEVELS } from '@/constants/levels';

const AVATAR_EMOJIS: Record<string, string> = {
  avatar_1: '🧑',
  avatar_2: '👩',
  avatar_3: '🧔',
  avatar_4: '👩‍🦱',
  avatar_5: '🧑‍🎓',
  avatar_6: '👩‍💼',
};

export default function ProfileScreen() {
  const { displayName, email, xp, level, avatarId, completedLessons, logout } = useUserStore();

  const currentLevel = getLevelForXP(xp);
  const nextLevel = getNextLevel(level);
  const progress = levelProgress(xp);
  const avatarEmoji = avatarId ? (AVATAR_EMOJIS[avatarId] ?? '🧑') : '🧑';

  async function handleLogout() {
    Alert.alert('Sair da Conta', 'Deseja realmente sair do aplicativo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await logoutService();
            logout();
          } catch (err) {
            console.error('Erro ao deslogar:', err);
          }
        },
      },
    ]);
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <View style={{ padding: 24, paddingTop: 56 }}>
        <Text style={{ color: '#f8fafc', fontSize: 28, fontWeight: 'bold', marginBottom: 24 }}>
          Meu Perfil 👤
        </Text>

        {/* Card Principal de Perfil */}
        <View style={{
          backgroundColor: '#1e293b',
          borderRadius: 24,
          padding: 24,
          alignItems: 'center',
          marginBottom: 24,
          borderWidth: 1,
          borderColor: '#334155',
        }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#0f172a',
            borderWidth: 3,
            borderColor: '#3b82f6',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: 40 }}>{avatarEmoji}</Text>
          </View>

          <Text style={{ color: '#f8fafc', fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>
            {displayName ?? 'Estudante'}
          </Text>
          <Text style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16 }}>
            {email ?? ''}
          </Text>

          {/* Badges de Status */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{
              backgroundColor: '#3b82f620',
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#3b82f6',
            }}>
              <Text style={{ color: '#60a5fa', fontWeight: 'bold', fontSize: 13 }}>
                Nível {level} • {currentLevel.name}
              </Text>
            </View>
            <View style={{
              backgroundColor: '#f59e0b20',
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#f59e0b',
            }}>
              <Text style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: 13 }}>
                {xp} XP
              </Text>
            </View>
          </View>
        </View>

        {/* Estatísticas */}
        <Text style={{ color: '#64748b', fontSize: 12, fontWeight: 'bold', marginBottom: 12 }}>
          ESTATÍSTICAS DO APRENDIZADO
        </Text>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          <View style={{
            flex: 1,
            backgroundColor: '#1e293b',
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: '#334155',
          }}>
            <Text style={{ fontSize: 24, marginBottom: 4 }}>🎯</Text>
            <Text style={{ color: '#f8fafc', fontSize: 22, fontWeight: 'bold' }}>
              {completedLessons.size}
            </Text>
            <Text style={{ color: '#94a3b8', fontSize: 12 }}>Lições Feitas</Text>
          </View>

          <View style={{
            flex: 1,
            backgroundColor: '#1e293b',
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: '#334155',
          }}>
            <Text style={{ fontSize: 24, marginBottom: 4 }}>⚡</Text>
            <Text style={{ color: '#f8fafc', fontSize: 22, fontWeight: 'bold' }}>
              {xp}
            </Text>
            <Text style={{ color: '#94a3b8', fontSize: 12 }}>Pontos de XP</Text>
          </View>
        </View>

        {/* Níveis de Conquista */}
        <Text style={{ color: '#64748b', fontSize: 12, fontWeight: 'bold', marginBottom: 12 }}>
          JORNADA DE NÍVEIS
        </Text>

        <View style={{ backgroundColor: '#1e293b', borderRadius: 20, padding: 16, marginBottom: 24, gap: 10 }}>
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
                  backgroundColor: isCurrent ? '#0f172a' : 'transparent',
                  borderRadius: 12,
                  borderWidth: isCurrent ? 1 : 0,
                  borderColor: '#3b82f6',
                }}
              >
                <Text style={{ fontSize: 20, marginRight: 12 }}>
                  {isUnlocked ? '🌟' : '🔒'}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    color: isUnlocked ? '#f8fafc' : '#64748b',
                    fontWeight: isCurrent ? 'bold' : 'normal',
                    fontSize: 14,
                  }}>
                    Nível {lvl.level}: {lvl.name}
                  </Text>
                  <Text style={{ color: '#64748b', fontSize: 11 }}>
                    {lvl.xpRequired} XP necessários
                  </Text>
                </View>
                {isCurrent && (
                  <View style={{ backgroundColor: '#3b82f6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>ATUAL</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Botão de Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: '#ef444420',
            borderRadius: 14,
            padding: 16,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#ef444450',
            marginBottom: 32,
          }}
        >
          <Text style={{ color: '#f87171', fontWeight: 'bold', fontSize: 15 }}>
            Sair da Conta 🚪
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
