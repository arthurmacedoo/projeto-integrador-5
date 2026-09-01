// ──────────────────────────────────────────────────────────────
// app/(app)/index.tsx
// Home / Dashboard — avatar, XP bar, card de trilha ativa
// ──────────────────────────────────────────────────────────────
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/useUserStore';
import { getLevelForXP, getNextLevel, levelProgress, xpToNextLevel } from '@/constants/levels';

export default function HomeScreen() {
  const router = useRouter();
  const { displayName, xp, level, avatarVariant, avatarId } = useUserStore();

  const currentLevel = getLevelForXP(xp);
  const nextLevel = getNextLevel(level);
  const progress = levelProgress(xp);
  const toNext = xpToNextLevel(xp);

  // Cor por nível
  const levelColors: Record<number, string> = {
    1: '#78716c', 2: '#22c55e', 3: '#3b82f6', 4: '#a855f7', 5: '#f59e0b',
  };
  const levelColor = levelColors[level] ?? '#3b82f6';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <View style={{ padding: 24, paddingTop: 56 }}>

        {/* Header: saudação */}
        <Text style={{ color: '#94a3b8', fontSize: 14, marginBottom: 4 }}>
          Bem-vindo de volta 👋
        </Text>
        <Text style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>
          {displayName ?? 'Estudante'}
        </Text>

        {/* Card: Avatar + XP */}
        <View style={{
          backgroundColor: '#1e293b',
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
              backgroundColor: '#0f172a',
              borderWidth: 3,
              borderColor: levelColor,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
            }}>
              <Text style={{ fontSize: 28 }}>🧑</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <View style={{
                  backgroundColor: levelColor + '30',
                  borderRadius: 8,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  marginRight: 8,
                }}>
                  <Text style={{ color: levelColor, fontWeight: 'bold', fontSize: 11 }}>
                    Nível {level}
                  </Text>
                </View>
                <Text style={{ color: '#94a3b8', fontSize: 12 }}>
                  {currentLevel.name}
                </Text>
              </View>
              <Text style={{ color: '#f1f5f9', fontWeight: 'bold', fontSize: 16 }}>
                {xp} XP total
              </Text>
            </View>
          </View>

          {/* Barra de XP */}
          <View style={{ marginBottom: 8 }}>
            <View style={{
              backgroundColor: '#0f172a',
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
            <Text style={{ color: '#64748b', fontSize: 12 }}>
              {toNext} XP para {nextLevel.name}
            </Text>
          ) : (
            <Text style={{ color: '#f59e0b', fontSize: 12 }}>
              🏆 Nível máximo atingido!
            </Text>
          )}
        </View>

        {/* Card: Trilha Ativa */}
        <Text style={{ color: '#94a3b8', fontSize: 14, fontWeight: '600', marginBottom: 12 }}>
          Continue de onde parou
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(app)/trails')}
          style={{
            backgroundColor: '#1e3a5f',
            borderRadius: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: '#3b82f6',
            marginBottom: 24,
          }}
        >
          <Text style={{ fontSize: 28, marginBottom: 8 }}>🛡️</Text>
          <Text style={{ color: '#f1f5f9', fontWeight: 'bold', fontSize: 18, marginBottom: 4 }}>
            Golpes Pix e WhatsApp
          </Text>
          <Text style={{ color: '#94a3b8', fontSize: 13, marginBottom: 12 }}>
            Aprenda a identificar e se proteger dos golpes mais comuns
          </Text>
          <View style={{
            backgroundColor: '#3b82f6',
            borderRadius: 10,
            paddingVertical: 10,
            alignItems: 'center',
          }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Continuar →</Text>
          </View>
        </TouchableOpacity>

        {/* Trilhas em breve */}
        <Text style={{ color: '#94a3b8', fontSize: 14, fontWeight: '600', marginBottom: 12 }}>
          Em breve
        </Text>
        {['💰 Orçamento Pessoal', '🚨 Reserva de Emergência', '📋 Formalização MEI'].map((t) => (
          <View key={t} style={{
            backgroundColor: '#1e293b',
            borderRadius: 14,
            padding: 16,
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: 22, marginRight: 12 }}>{t.split(' ')[0]}</Text>
            <Text style={{ color: '#475569', fontSize: 15 }}>{t.substring(3)}</Text>
            <Text style={{ marginLeft: 'auto', color: '#475569', fontSize: 12 }}>🔒</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
