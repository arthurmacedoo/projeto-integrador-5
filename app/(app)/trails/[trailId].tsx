// app/(app)/trails/[trailId].tsx
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getLessonsForTrail } from '@/services/trail.service';
import { useUserStore } from '@/store/useUserStore';
import type { LessonSummary } from '@/types';
import { useAppTheme } from '@/constants/theme';

export default function TrailDetailScreen() {
  const { colors, fs, highContrast } = useAppTheme();
  const { trailId } = useLocalSearchParams<{ trailId: string }>();
  const router = useRouter();
  // Assina o Map de progresso: a tela atualiza assim que uma lição é concluída
  const completedLessons = useUserStore((s) => s.completedLessons);
  const isLessonCompleted = (id: string) => completedLessons.has(id);

  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!trailId) return;
      try {
        const data = await getLessonsForTrail(trailId);
        setLessons(data);
      } catch (err) {
        console.error('Erro ao carregar lições:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [trailId]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const completedCount = lessons.filter((l) => isLessonCompleted(l.id)).length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 24, paddingTop: 56 }}>
        {/* Voltar */}
        <TouchableOpacity
          onPress={() => router.push('/(app)/trails')}
          style={{ marginBottom: 16 }}
        >
          <Text style={{ color: colors.accentText, fontSize: fs(14), fontWeight: '600' }}>
            ← Voltar para Trilhas
          </Text>
        </TouchableOpacity>

        {/* Header da Trilha */}
        <Text style={{ color: colors.text, fontSize: fs(26), fontWeight: 'bold', marginBottom: 6 }}>
          Golpes Pix e WhatsApp
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: fs(14), marginBottom: 20 }}>
          8 lições interativas baseadas em casos reais da Baixada Cuiabana
        </Text>

        {/* Card de Progresso */}
        <View style={{
          backgroundColor: colors.surface,
          ...(highContrast && { borderWidth: 1, borderColor: colors.border }),
          borderRadius: 16,
          padding: 16,
          marginBottom: 24,
          borderWidth: 1,
          borderColor: colors.border,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: colors.textSoft, fontSize: fs(13), fontWeight: '600' }}>
              Progresso da Trilha
            </Text>
            <Text style={{ color: colors.primary, fontSize: fs(13), fontWeight: 'bold' }}>
              {completedCount}/{lessons.length} Concluídas ({progressPercent}%)
            </Text>
          </View>
          <View style={{
            backgroundColor: colors.background,
            borderRadius: 99,
            height: 8,
            overflow: 'hidden',
          }}>
            <View style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: colors.primary,
              borderRadius: 99,
            }} />
          </View>
        </View>

        {/* Lista de Lições */}
        <Text style={{ color: colors.textSubtle, fontSize: fs(12), fontWeight: 'bold', marginBottom: 12 }}>
          LIÇÕES DISPONÍVEIS
        </Text>

        <View style={{ gap: 12 }}>
          {lessons.map((lesson, index) => {
            const isCompleted = isLessonCompleted(lesson.id);
            // Primeira lição sempre liberada, ou se a anterior foi concluída
            const isUnlocked = index === 0 || isLessonCompleted(lessons[index - 1].id);

            return (
              <TouchableOpacity
                key={lesson.id}
                disabled={!isUnlocked}
                onPress={() => {
                  router.push({
                    pathname: '/(app)/trails/lesson/[lessonId]',
                    params: { trailId, lessonId: lesson.id },
                  } as any);
                }}
                style={{
                  backgroundColor: isCompleted ? colors.successSoftDeep : isUnlocked ? colors.surface : colors.background,
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: isCompleted ? colors.successDeep : isUnlocked ? colors.primaryBorder : (highContrast ? colors.border : colors.surface),
                  flexDirection: 'row',
                  alignItems: 'center',
                  opacity: isUnlocked ? 1 : 0.5,
                }}
              >
                {/* Ícone de Status */}
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: isCompleted ? colors.successSoft : isUnlocked ? colors.surfaceSelected : colors.surface,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 14,
                }}>
                  <Text style={{ fontSize: fs(18) }}>
                    {isCompleted ? '✅' : isUnlocked ? '▶️' : '🔒'}
                  </Text>
                </View>

                {/* Conteúdo */}
                <View style={{ flex: 1 }}>
                  <Text style={{
                    color: isUnlocked ? colors.text : colors.textSubtle,
                    fontSize: fs(15),
                    fontWeight: 'bold',
                    marginBottom: 2,
                  }}>
                    {lesson.title}
                  </Text>
                  <Text style={{ color: colors.warningBase, fontSize: fs(12), fontWeight: '600' }}>
                    +{lesson.xpReward} XP
                  </Text>
                </View>

                {isCompleted && (
                  <View style={{
                    backgroundColor: colors.successDeep,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 8,
                  }}>
                    <Text style={{ color: colors.onPrimary, fontSize: fs(11), fontWeight: 'bold' }}>Feito</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}
