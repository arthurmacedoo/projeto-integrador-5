// ──────────────────────────────────────────────────────────────
// components/slides/XPRewardSlide.tsx
// Slide 4 de 4 · Lição Concluída (Idêntico à Tela 14 do PDF FinEdu)
// ──────────────────────────────────────────────────────────────
import { View, Text, ScrollView } from 'react-native';
import { useUserStore } from '@/store/useUserStore';
import {
  ShieldHeroIllustration,
  IconSparkle,
} from '@/components/ui/FinEduIcons';

interface Props {
  xpEarned: number;
  isCorrect: boolean;
  lessonTitle?: string;
  lessonId?: string;
}

export default function XPRewardSlide({
  xpEarned,
  isCorrect,
  lessonTitle,
  lessonId,
}: Props) {
  const { xp, completedLessons } = useUserStore();

  const alreadyCompleted = lessonId ? completedLessons.has(lessonId) : false;
  const previousXP = xp;
  const projectedTotalXP = alreadyCompleted ? xp : xp + xpEarned;

  const totalLessons = 8;
  const projectedCompletedCount = Math.min(
    alreadyCompleted ? completedLessons.size : completedLessons.size + 1,
    totalLessons
  );
  const progressPercent = (projectedCompletedCount / totalLessons) * 100;
  const formattedPercent = progressPercent
    .toFixed(1)
    .replace('.0', '')
    .replace('.', ',');

  const cleanTitle = lessonTitle
    ? lessonTitle.replace(/^\d+\.\s*/, '')
    : 'A Promoção Imperdível';

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 12 }}
    >
      {/* Card Principal de Recompensa */}
      <View className="items-center py-2 mb-4">
        <ShieldHeroIllustration variant="star" compact />

        <Text
          style={{ color: '#1A4731' }}
          className="text-4xl font-extrabold mt-2 mb-1.5"
        >
          +{xpEarned} XP
        </Text>

        <Text className="text-ink text-xl font-extrabold text-center mb-1.5">
          Mais preparo. Mais confiança.
        </Text>

        <Text className="text-ink-muted text-xs text-center leading-relaxed px-4">
          {isCorrect
            ? `Você concluiu ${cleanTitle} e aprendeu a verificar antes de pagar.`
            : `Você concluiu ${cleanTitle}. Cada prática fortalece suas escolhas no dia a dia.`}
        </Text>
      </View>

      {/* Card Verde Escuro: Seu total agora */}
      <View
        style={{ backgroundColor: '#1A4731' }}
        className="rounded-2xl p-4 flex-row items-center justify-between mb-3.5"
      >
        <View>
          <Text style={{ color: '#A3C9B3' }} className="text-[11px] mb-0.5">
            Seu total agora
          </Text>
          <View className="flex-row items-center">
            <View className="mr-1.5">
              <IconSparkle size={16} color="#D9ECAE" />
            </View>
            <Text className="text-white text-xl font-extrabold">
              {projectedTotalXP} XP
            </Text>
          </View>
        </View>

        <View
          style={{ backgroundColor: '#2B5B42' }}
          className="px-3 py-1 rounded-full"
        >
          <Text className="text-white text-xs font-bold">
            {previousXP} + {alreadyCompleted ? 0 : xpEarned}
          </Text>
        </View>
      </View>

      {/* Card Branco de Progresso na Trilha */}
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: '#E3DFD3',
          borderWidth: 1,
        }}
        className="rounded-2xl p-4"
      >
        <Text className="text-ink text-xs font-extrabold mb-1">
          Golpes Pix/WhatsApp
        </Text>
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-ink-muted text-xs">
            {projectedCompletedCount} de {totalLessons} lições concluídas
          </Text>
          <Text className="text-ink text-xs font-extrabold">
            {formattedPercent}%
          </Text>
        </View>
        <View
          style={{ backgroundColor: '#E6E2D6' }}
          className="rounded-full h-2 overflow-hidden"
        >
          <View
            style={{
              width: `${Math.max(8, progressPercent)}%`,
              backgroundColor: '#1A4731',
            }}
            className="h-full rounded-full"
          />
        </View>
      </View>
    </ScrollView>
  );
}
