// ──────────────────────────────────────────────────────────────
// app/(app)/trails/[trailId].tsx
// Detalhe da Trilha — Timeline vertical de lições 1 a 8 (Tela 9 do PDF FinEdu)
// ──────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getLessonsForTrail } from '@/services/trail.service';
import { useUserStore } from '@/store/useUserStore';
import type { LessonSummary } from '@/types';
import {
  IconShieldOutline,
  IconCheck,
  IconLock,
  IconInfoCircle,
} from '@/components/ui/FinEduIcons';

const FALLBACK_LESSONS: LessonSummary[] = [
  { id: 'lesson_01', title: 'A Mensagem Suspeita', order: 1, xpReward: 50 },
  { id: 'lesson_02', title: 'O Link do Banco', order: 2, xpReward: 60 },
  { id: 'lesson_03', title: 'A Promoção Imperdível', order: 3, xpReward: 60 },
  { id: 'lesson_04', title: 'O Parente em Apuros', order: 4, xpReward: 70 },
  { id: 'lesson_05', title: 'A Vaga de Emprego', order: 5, xpReward: 70 },
  { id: 'lesson_06', title: 'O Bilhete Premiado', order: 6, xpReward: 80 },
  { id: 'lesson_07', title: 'A Chave Pix Errada', order: 7, xpReward: 80 },
  { id: 'lesson_08', title: 'Você é o Guardião', order: 8, xpReward: 100 },
];

function cleanLessonTitle(title: string): string {
  return title.replace(/^\d+\.\s*/, '');
}

export default function TrailDetailScreen() {
  const { trailId } = useLocalSearchParams<{ trailId: string }>();
  const router = useRouter();
  const { isLessonCompleted } = useUserStore();

  const [lessons, setLessons] = useState<LessonSummary[]>(FALLBACK_LESSONS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!trailId) return;
      try {
        const data = await Promise.race([
          getLessonsForTrail(trailId),
          new Promise<LessonSummary[]>((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 1200)
          ),
        ]);
        if (data.length > 0) {
          setLessons(data);
        }
      } catch {
        setLessons(FALLBACK_LESSONS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [trailId]);

  if (loading) {
    return (
      <View
        style={{ flex: 1, backgroundColor: '#F7F6F0' }}
        className="justify-center items-center"
      >
        <ActivityIndicator size="large" color="#1A4731" />
      </View>
    );
  }

  const completedCount = lessons.filter((l) => isLessonCompleted(l.id)).length;
  const progressPercent =
    lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F6F0' }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: '#F7F6F0' }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-8 pb-8">
          {/* Voltar */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center self-start mb-4"
          >
            <View
              style={{ backgroundColor: '#EFECE4' }}
              className="w-8 h-8 rounded-full items-center justify-center mr-2.5"
            >
              <Text className="text-ink text-sm font-bold">←</Text>
            </View>
            <Text className="text-ink text-xs font-bold">Sua trilha</Text>
          </TouchableOpacity>

          {/* Badge PROTEÇÃO DIGITAL */}
          <View
            style={{ backgroundColor: '#E5ECD8' }}
            className="rounded-md px-2.5 py-1 self-start flex-row items-center mb-2.5"
          >
            <View className="mr-1.5">
              <IconShieldOutline size={12} color="#1A4731" />
            </View>
            <Text
              style={{ color: '#1A4731' }}
              className="text-[10px] font-extrabold tracking-wider uppercase"
            >
              PROTEÇÃO DIGITAL
            </Text>
          </View>

          <Text className="text-ink text-2xl font-extrabold leading-tight mb-1.5">
            Golpes Pix/WhatsApp
          </Text>
          <Text className="text-ink-muted text-xs leading-relaxed mb-3">
            Da mensagem suspeita à escolha segura: pratique uma situação por vez.
          </Text>

          <Text className="text-ink text-xs font-extrabold mb-3.5">
            8 lições · Até 570 XP na trilha
          </Text>

          {/* Box de Progresso */}
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: '#E6E2D6',
              borderWidth: 1,
            }}
            className="rounded-2xl p-3.5 mb-5"
          >
            <View className="flex-row items-center justify-between mb-1.5">
              <Text className="text-ink-muted text-xs">
                {completedCount} de {lessons.length} lições concluídas
              </Text>
              <Text className="text-ink text-xs font-extrabold">
                {progressPercent}%
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

          {/* Seção: Seu caminho até aqui */}
          <Text className="text-ink text-sm font-extrabold mb-3.5">
            Seu caminho até aqui
          </Text>

          {/* Timeline Vertical de Lições 1 a 8 */}
          <View>
            {lessons.map((lesson, index) => {
              const isCompleted = isLessonCompleted(lesson.id);
              const isUnlocked =
                index === 0 || isLessonCompleted(lessons[index - 1].id);
              const isCurrentAvailable = isUnlocked && !isCompleted;
              const isLastItem = index === lessons.length - 1;
              const lessonNumber = lesson.order ?? index + 1;
              const displayTitle = cleanLessonTitle(lesson.title);

              const handlePress = () => {
                router.push({
                  pathname: '/(app)/trails/lesson/[lessonId]',
                  params: {
                    trailId: trailId ?? 'trail_golpes',
                    lessonId: lesson.id,
                  },
                } as any);
              };

              return (
                <View key={lesson.id} className="flex-row items-stretch">
                  {/* Coluna da Esquerda: Nó da Timeline + Linha Vertical */}
                  <View className="items-center mr-3" style={{ width: 32 }}>
                    {isCompleted ? (
                      <View
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          backgroundColor: '#1A4731',
                        }}
                        className="items-center justify-center mt-1"
                      >
                        <IconCheck size={14} color="#FFFFFF" />
                      </View>
                    ) : isCurrentAvailable ? (
                      <View
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 15,
                          backgroundColor: '#D9ECAE',
                          borderColor: '#1A4731',
                          borderWidth: 2,
                        }}
                        className="items-center justify-center mt-1"
                      >
                        <Text
                          style={{ color: '#1A4731' }}
                          className="text-xs font-extrabold"
                        >
                          {lessonNumber}
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          backgroundColor: '#EFECE4',
                        }}
                        className="items-center justify-center mt-1"
                      >
                        <IconLock size={13} color="#8C887E" />
                      </View>
                    )}

                    {/* Linha conectora vertical */}
                    {!isLastItem && (
                      <View
                        style={{
                          width: 2,
                          flex: 1,
                          backgroundColor: isCompleted ? '#1A4731' : '#D6D2C4',
                          marginVertical: 4,
                        }}
                      />
                    )}
                  </View>

                  {/* Coluna da Direita: Card da Lição */}
                  <View className="flex-1 pb-3">
                    {isCurrentAvailable ? (
                      <View
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderColor: '#1A4731',
                          borderWidth: 2,
                        }}
                        className="rounded-2xl p-4"
                      >
                        <View className="flex-row items-center justify-between mb-1">
                          <Text
                            style={{ color: '#1A4731' }}
                            className="text-[11px] font-bold"
                          >
                            Lição {lessonNumber}
                          </Text>
                          <Text className="text-ink text-[11px] font-extrabold">
                            {lesson.xpReward} XP
                          </Text>
                        </View>

                        <Text className="text-ink text-sm font-extrabold mb-0.5">
                          {displayTitle}
                        </Text>
                        <Text
                          style={{ color: '#1A4731' }}
                          className="text-[11px] font-bold mb-3"
                        >
                          Disponível · Sua próxima história
                        </Text>

                        <TouchableOpacity
                          onPress={handlePress}
                          activeOpacity={0.85}
                          style={{ backgroundColor: '#1A4731' }}
                          className="w-full rounded-full py-2.5 px-4 flex-row items-center justify-center"
                        >
                          <Text className="text-white font-bold text-xs mr-1.5">
                            Começar lição
                          </Text>
                          <Text className="text-white font-bold text-xs">→</Text>
                        </TouchableOpacity>
                      </View>
                    ) : isCompleted ? (
                      <TouchableOpacity
                        onPress={handlePress}
                        activeOpacity={0.8}
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderColor: '#E6E2D6',
                          borderWidth: 1,
                        }}
                        className="rounded-2xl p-3.5"
                      >
                        <View className="flex-row items-center justify-between mb-0.5">
                          <Text className="text-ink-muted text-[11px]">
                            Lição {lessonNumber}
                          </Text>
                          <Text className="text-ink text-[11px] font-extrabold">
                            {lesson.xpReward} XP
                          </Text>
                        </View>
                        <Text className="text-ink text-xs font-extrabold mb-0.5">
                          {displayTitle}
                        </Text>
                        <Text className="text-ink-muted text-[11px]">
                          Concluída
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={handlePress}
                        activeOpacity={0.8}
                        style={{
                          backgroundColor: '#F2F0E8',
                          borderColor: '#E6E2D6',
                          borderWidth: 1,
                        }}
                        className="rounded-2xl p-3.5"
                      >
                        <View className="flex-row items-center justify-between mb-0.5">
                          <Text className="text-ink-subtle text-[11px]">
                            Lição {lessonNumber}
                          </Text>
                          <Text className="text-ink-muted text-[11px] font-bold">
                            {lesson.xpReward} XP
                          </Text>
                        </View>
                        <Text className="text-ink font-bold text-xs mb-0.5">
                          {displayTitle}
                        </Text>
                        <Text className="text-ink-subtle text-[11px]">
                          Bloqueada · Conclua a anterior
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Nota de rodapé */}
          <View
            style={{ backgroundColor: '#EFECE4' }}
            className="rounded-2xl p-3.5 mt-3 flex-row items-center"
          >
            <View className="mr-2.5">
              <IconInfoCircle size={15} color="#78716C" />
            </View>
            <Text className="text-ink-muted text-[11px] flex-1 leading-snug">
              Pode revisar quando quiser. Cada lição dá XP apenas uma vez.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
