// ──────────────────────────────────────────────────────────────
// app/(app)/profile.tsx
// Meu Perfil — Idêntico à Tela 16 do PDF FinEdu
// ──────────────────────────────────────────────────────────────
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/useUserStore';
import { logout as logoutService } from '@/services/auth.service';
import {
  getLevelForXP,
  getNextLevel,
  levelProgress,
  xpToNextLevel,
  LEVELS,
} from '@/constants/levels';
import {
  AvatarPortrait,
  IconBackpack,
  IconSparkle,
  IconCheckCircle,
  IconSprout,
  IconShirt,
  IconGlasses,
  IconMedal,
  IconCheck,
  IconLock,
  IconLogout,
} from '@/components/ui/FinEduIcons';

const LESSON_TITLES: Record<string, string> = {
  lesson_01: 'A Mensagem Suspeita',
  lesson_02: 'O Link do Banco',
  lesson_03: 'A Promoção Imperdível',
  lesson_04: 'O Parente em Apuros',
  lesson_05: 'A Vaga de Emprego',
  lesson_06: 'O Bilhete Premiado',
  lesson_07: 'A Chave Pix Errada',
  lesson_08: 'Você é o Guardião',
};

const LEVEL_REWARD_DESCRIPTIONS: Record<number, string> = {
  1: 'Roupa simples',
  2: 'Mochila',
  3: 'Roupa nova',
  4: 'Óculos ou relógio',
  5: 'Visual completo e badge dourado',
};

function LevelRewardIcon({ levelNum, active }: { levelNum: number; active: boolean }) {
  const color = active ? '#1A4731' : '#57534E';
  if (levelNum === 1) return <IconSprout size={16} color={color} />;
  if (levelNum === 2) return <IconBackpack size={16} color={color} />;
  if (levelNum === 3) return <IconShirt size={16} color={color} />;
  if (levelNum === 4) return <IconGlasses size={16} color={color} />;
  return <IconMedal size={16} color={active ? '#B45309' : '#8C6D3F'} />;
}

export default function ProfileScreen() {
  const router = useRouter();
  const {
    displayName,
    email,
    xp,
    level,
    avatarId,
    completedLessons,
    logout,
  } = useUserStore();

  const currentLevel = getLevelForXP(xp);
  const nextLevel = getNextLevel(level);
  const progress = levelProgress(xp);
  const toNext = xpToNextLevel(xp);

  const completedEntries = Array.from(completedLessons.values());
  const xpSumFormula =
    completedEntries.length > 0
      ? `${completedEntries.map((e) => e.xpEarned).join(' + ')} = ${xp} XP.`
      : '';

  async function handleLogout() {
    if (Platform.OS === 'web') {
      try {
        await logoutService();
      } catch {
        // Ignora se modo demo
      }
      logout();
      router.replace('/onboarding' as any);
      return;
    }

    Alert.alert('Sair da Conta', 'Deseja realmente sair do aplicativo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await logoutService();
          } catch {
            // Ignora se modo demo
          }
          logout();
          router.replace('/onboarding' as any);
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F6F0' }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: '#F7F6F0' }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-8 pb-10">
          {/* Título */}
          <Text className="text-ink text-2xl font-extrabold mb-4">
            Meu perfil
          </Text>

          {/* Card Principal de Perfil */}
          <View
            style={{ backgroundColor: '#EFECE4' }}
            className="rounded-3xl p-5 items-center mb-4"
          >
            <View
              style={{
                borderWidth: 3,
                borderColor: '#FFFFFF',
                borderRadius: 999,
              }}
              className="mb-3"
            >
              <AvatarPortrait
                id={avatarId ?? 'avatar_1'}
                size={84}
                evolved={level >= 2}
              />
            </View>

            <Text className="text-ink text-lg font-extrabold mb-1.5">
              {displayName ?? 'Ana Silva'}
            </Text>

            <View className="bg-white rounded-full px-3.5 py-1 flex-row items-center mb-3 border border-sand-border">
              <View className="mr-1.5">
                {level >= 2 ? (
                  <IconBackpack size={13} color="#1A4731" />
                ) : (
                  <IconSprout size={13} color="#1A4731" />
                )}
              </View>
              <Text style={{ color: '#1A4731' }} className="text-xs font-extrabold">
                Nível {level} · {currentLevel.name}
              </Text>
            </View>

            {/* E-mail somente leitura */}
            <Text className="text-ink-muted text-xs">
              {email ?? 'ana.silva@exemplo.com'}
            </Text>
            <Text className="text-ink-subtle text-[11px] mt-0.5">
              E-mail · Somente leitura
            </Text>
          </View>

          {/* Card Verde Escuro: XP acumulados */}
          <View
            style={{ backgroundColor: '#1A4731' }}
            className="rounded-3xl p-5 mb-5"
          >
            <View className="flex-row items-start justify-between mb-2">
              <View>
                <Text style={{ color: '#A3C9B3' }} className="text-[11px] mb-0.5">
                  XP acumulados
                </Text>
                <Text className="text-white text-3xl font-extrabold">
                  {xp} XP
                </Text>
              </View>
              <View
                style={{ backgroundColor: '#23573D' }}
                className="w-9 h-9 rounded-xl items-center justify-center"
              >
                <IconSparkle size={18} color="#D9ECAE" />
              </View>
            </View>

            {/* Barra de Progresso verde-lima */}
            <View
              style={{ backgroundColor: '#123322' }}
              className="rounded-full h-2 overflow-hidden my-2.5"
            >
              <View
                style={{
                  width: `${Math.max(12, Math.round(progress * 100))}%`,
                  backgroundColor: '#B8E070',
                }}
                className="h-full rounded-full"
              />
            </View>

            {nextLevel ? (
              <>
                <Text style={{ color: '#D8EBE0' }} className="text-xs leading-snug mb-1.5">
                  Faltam {toNext} XP para o nível {nextLevel.level} ·{' '}
                  {nextLevel.name}, aos {nextLevel.xpRequired} XP.
                </Text>
                <Text style={{ color: '#9CC2AE' }} className="text-[11px]">
                  {currentLevel.name} {currentLevel.xpRequired} XP — {nextLevel.name} {nextLevel.xpRequired} XP
                </Text>
              </>
            ) : (
              <Text style={{ color: '#D8EBE0' }} className="text-xs">
                Você atingiu o nível máximo de Guardião Financeiro!
              </Text>
            )}
          </View>

          {/* Seção: Seu aprendizado */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-ink text-sm font-extrabold">
              Seu aprendizado
            </Text>
            <Text className="text-ink-muted text-xs">
              {completedEntries.length} lições
            </Text>
          </View>

          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: '#E6E2D6',
              borderWidth: 1,
            }}
            className="rounded-2xl px-4 py-1 mb-2"
          >
            {completedEntries.map((entry, idx) => {
              const title =
                LESSON_TITLES[entry.lessonId] ?? entry.lessonId;
              const isLast = idx === completedEntries.length - 1;
              return (
                <View
                  key={entry.lessonId}
                  style={{
                    borderBottomWidth: isLast ? 0 : 1,
                    borderBottomColor: '#EFECE4',
                  }}
                  className="py-3 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center flex-1 mr-3">
                    <View className="mr-3">
                      <IconCheckCircle size={16} color="#1A4731" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-ink text-xs font-extrabold">
                        {title}
                      </Text>
                      <Text className="text-ink-muted text-[11px]">
                        Golpes Pix/WhatsApp
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{ color: '#1A4731' }}
                    className="font-extrabold text-xs"
                  >
                    +{entry.xpEarned} XP
                  </Text>
                </View>
              );
            })}
          </View>

          <Text className="text-ink-subtle text-[11px] mb-5">
            {xpSumFormula} Revisar uma lição não gera XP extra.
          </Text>

          {/* Seção: Sua evolução (Níveis 1 a 5) */}
          <Text className="text-ink text-sm font-extrabold mb-3">
            Sua evolução
          </Text>

          <View className="gap-2.5 mb-6">
            {LEVELS.map((lvl) => {
              const isUnlocked = level >= lvl.level;
              const isCurrent = level === lvl.level;
              const rewardDesc =
                LEVEL_REWARD_DESCRIPTIONS[lvl.level] ?? 'Evolução visual';

              return (
                <View
                  key={lvl.level}
                  style={{
                    backgroundColor: isCurrent ? '#EDF4E4' : '#FFFFFF',
                    borderColor: isCurrent ? '#1A4731' : '#E6E2D6',
                    borderWidth: isCurrent ? 2 : 1,
                  }}
                  className="rounded-2xl p-3.5 flex-row items-center"
                >
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      backgroundColor: isCurrent ? '#D9ECAE' : '#EFECE4',
                    }}
                    className="items-center justify-center mr-3"
                  >
                    <LevelRewardIcon levelNum={lvl.level} active={isUnlocked} />
                  </View>

                  <View className="flex-1 mr-2">
                    <Text className="text-ink text-xs font-extrabold">
                      {lvl.level} · {lvl.name}
                    </Text>
                    <Text
                      style={{ color: isCurrent ? '#1A4731' : '#78716C' }}
                      className="text-[11px]"
                    >
                      {lvl.xpRequired} XP · {rewardDesc}
                      {isCurrent ? ' · Seu nível atual' : ''}
                    </Text>
                  </View>

                  {isUnlocked ? (
                    <IconCheck size={14} color="#1A4731" />
                  ) : (
                    <IconLock size={14} color="#A8A29E" />
                  )}
                </View>
              );
            })}
          </View>

          {/* Botão Sair */}
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.8}
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: '#D6D0C4',
              borderWidth: 1,
            }}
            className="w-full rounded-full py-3.5 px-6 flex-row items-center justify-center"
          >
            <Text
              style={{ color: '#1A4731' }}
              className="font-extrabold text-xs mr-2"
            >
              Sair
            </Text>
            <IconLogout size={15} color="#1A4731" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
