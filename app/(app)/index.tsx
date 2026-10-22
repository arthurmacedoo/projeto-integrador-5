// ──────────────────────────────────────────────────────────────
// app/(app)/index.tsx
// Home / Dashboard — Idêntico à Tela 7 do PDF FinEdu
// ──────────────────────────────────────────────────────────────
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/useUserStore';
import { getLevelForXP, getNextLevel, levelProgress, xpToNextLevel } from '@/constants/levels';
import {
  FinEduBrand,
  AvatarPortrait,
  IconSprout,
  IconWifiOff,
  IconShieldOutline,
  IconBudget,
  IconUmbrella,
  IconStore,
  IconLock,
} from '@/components/ui/FinEduIcons';

const DEFAULT_LESSON_TITLES = [
  { id: 'lesson_01', title: 'A Mensagem Suspeita' },
  { id: 'lesson_02', title: 'O Link do Banco' },
  { id: 'lesson_03', title: 'A Promoção Imperdível' },
  { id: 'lesson_04', title: 'O Parente em Apuros' },
  { id: 'lesson_05', title: 'A Vaga de Emprego' },
  { id: 'lesson_06', title: 'O Bilhete Premiado' },
  { id: 'lesson_07', title: 'A Chave Pix Errada' },
  { id: 'lesson_08', title: 'Você é o Guardião' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { displayName, xp, level, avatarId, completedLessons } = useUserStore();

  const currentLevel = getLevelForXP(xp);
  const nextLevel = getNextLevel(level);
  const progress = levelProgress(xp);
  const toNext = xpToNextLevel(xp);

  const firstName = displayName ? displayName.trim().split(' ')[0] : 'Ana';

  const totalLessons = 8;
  const completedCount = Math.min(completedLessons.size, totalLessons);
  const trailPercent = Math.round((completedCount / totalLessons) * 100);

  const nextLessonObj =
    DEFAULT_LESSON_TITLES.find((l) => !completedLessons.has(l.id)) ??
    DEFAULT_LESSON_TITLES[2];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F6F0' }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: '#F7F6F0' }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-8 pb-8">
          {/* Top Bar: Brand à esquerda + Avatar à direita */}
          <View className="flex-row items-center justify-between mb-4">
            <FinEduBrand size="sm" />
            <TouchableOpacity
              onPress={() => router.push('/(app)/profile')}
              activeOpacity={0.8}
            >
              <AvatarPortrait
                id={avatarId ?? 'avatar_1'}
                size={36}
                evolved={level >= 2}
              />
            </TouchableOpacity>
          </View>

          {/* Header: Saudação */}
          <Text className="text-ink text-2xl font-extrabold leading-tight mb-1">
            Vamos juntos, {firstName}?
          </Text>
          <Text className="text-ink-muted text-xs leading-relaxed mb-4">
            Um pouco de aprendizado, mais confiança para o dia a dia.
          </Text>

          {/* Card de Nível / XP */}
          <View
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E2D6', borderWidth: 1 }}
            className="rounded-3xl p-4 mb-3.5"
          >
            <View className="flex-row items-center mb-3">
              {/* Ícone de Broto em círculo verde-lima suave */}
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: '#E8F0DC',
                }}
                className="items-center justify-center mr-3"
              >
                <IconSprout size={20} color="#1A4731" />
              </View>

              {/* Nível + XP atual */}
              <View className="flex-1">
                <Text className="text-ink-muted text-[11px] font-semibold mb-0.5">
                  Nível {level} · {currentLevel.name}
                </Text>
                <Text className="text-ink text-xl font-extrabold">
                  {xp} XP
                </Text>
              </View>

              {/* Meta do próximo nível */}
              {nextLevel && (
                <View
                  style={{ backgroundColor: '#EFECE4' }}
                  className="px-3 py-1 rounded-full"
                >
                  <Text className="text-ink text-xs font-extrabold">
                    {nextLevel.xpRequired} XP
                  </Text>
                </View>
              )}
            </View>

            {/* Barra de Progresso de XP */}
            <View
              style={{ backgroundColor: '#E6E2D6' }}
              className="rounded-full h-2 overflow-hidden mb-2"
            >
              <View
                style={{
                  width: `${Math.max(10, Math.round(progress * 100))}%`,
                  backgroundColor: '#1A4731',
                }}
                className="h-full rounded-full"
              />
            </View>

            {nextLevel ? (
              <Text className="text-ink-muted text-[11px]">
                Faltam {toNext} XP para o nível {nextLevel.level} · {nextLevel.name}.
              </Text>
            ) : (
              <Text style={{ color: '#1A4731' }} className="text-[11px] font-bold">
                Você alcançou o nível máximo: Guardião Financeiro!
              </Text>
            )}
          </View>

          {/* Aviso de Modo Offline */}
          <View
            style={{
              backgroundColor: '#F7EED2',
              borderColor: '#E8D49B',
              borderWidth: 1,
            }}
            className="rounded-2xl p-3.5 mb-4 flex-row items-start"
          >
            <View className="mr-3 mt-0.5">
              <IconWifiOff size={16} color="#57534E" />
            </View>
            <View className="flex-1">
              <Text className="text-ink text-xs font-bold leading-snug">
                Você está offline — seu progresso será sincronizado quando voltar
              </Text>
              <Text className="text-ink-muted text-[11px] mt-0.5">
                As lições já carregadas continuam disponíveis.
              </Text>
            </View>
          </View>

          {/* Card Verde Escuro: EM PROGRESSO */}
          <View
            style={{ backgroundColor: '#1A4731' }}
            className="rounded-3xl p-5 mb-5"
          >
            <View className="flex-row items-center justify-between mb-3">
              <View
                style={{ backgroundColor: '#D9ECAE' }}
                className="px-3 py-1 rounded-full"
              >
                <Text
                  style={{ color: '#1A4731' }}
                  className="text-[10px] font-extrabold tracking-wider uppercase"
                >
                  EM PROGRESSO
                </Text>
              </View>
              <IconShieldOutline size={20} color="#8AB89A" />
            </View>

            <Text className="text-white text-xl font-extrabold mb-2">
              Golpes Pix/WhatsApp
            </Text>

            <View className="flex-row items-center justify-between mb-1.5">
              <Text style={{ color: '#C6E0D0' }} className="text-xs">
                {completedCount} de {totalLessons} lições concluídas
              </Text>
              <Text className="text-white text-xs font-bold">
                {trailPercent}%
              </Text>
            </View>

            {/* Barra de progresso verde-lima */}
            <View
              style={{ backgroundColor: '#123322' }}
              className="rounded-full h-2 overflow-hidden mb-4"
            >
              <View
                style={{
                  width: `${Math.max(8, trailPercent)}%`,
                  backgroundColor: '#B8E070',
                }}
                className="h-full rounded-full"
              />
            </View>

            {/* Sub-card: Sua próxima história */}
            <View
              style={{
                backgroundColor: '#143826',
                borderColor: '#25563D',
                borderWidth: 1,
              }}
              className="rounded-2xl p-3.5 mb-4"
            >
              <Text style={{ color: '#A3C9B3' }} className="text-[11px] mb-0.5">
                Sua próxima história · 3–5 min
              </Text>
              <Text className="text-white text-sm font-bold">
                {nextLessonObj.title}
              </Text>
            </View>

            {/* CTA Continuar lição (Verde-lima suave como no PDF) */}
            <TouchableOpacity
              onPress={() => router.push('/(app)/trails/trail_golpes' as any)}
              activeOpacity={0.85}
              style={{ backgroundColor: '#D9ECAE' }}
              className="w-full rounded-full py-3.5 px-5 flex-row items-center justify-center"
            >
              <Text
                style={{ color: '#1A4731' }}
                className="font-extrabold text-xs mr-1.5"
              >
                Continuar lição
              </Text>
              <Text style={{ color: '#1A4731' }} className="font-extrabold text-xs">
                →
              </Text>
            </TouchableOpacity>
          </View>

          {/* Seção: Mais para aprender */}
          <Text className="text-ink text-sm font-extrabold mb-3">
            Mais para aprender
          </Text>

          {[
            { title: 'Orçamento Pessoal', Icon: IconBudget },
            { title: 'Reserva de Emergência', Icon: IconUmbrella },
            { title: 'Formalização MEI', Icon: IconStore },
          ].map(({ title, Icon }) => (
            <View
              key={title}
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E6E2D6',
                borderWidth: 1,
              }}
              className="rounded-2xl p-3.5 mb-2.5 flex-row items-center justify-between"
            >
              <View className="flex-row items-center flex-1 mr-3">
                <View
                  style={{ backgroundColor: '#EFECE4' }}
                  className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                >
                  <Icon size={18} color="#57534E" />
                </View>
                <View>
                  <Text className="text-ink font-bold text-xs">{title}</Text>
                  <Text className="text-ink-subtle text-[11px] mt-0.5">
                    Em breve
                  </Text>
                </View>
              </View>
              <IconLock size={16} color="#A8A29E" />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
