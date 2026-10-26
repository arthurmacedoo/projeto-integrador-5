// app/(app)/trails/[trailId].tsx
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getLessonsForTrail } from '@/services/trail.service';
import { useUserStore } from '@/store/useUserStore';
import type { LessonSummary } from '@/types';

export default function TrailDetailScreen() {
  const { trailId } = useLocalSearchParams<{ trailId: string }>();
  const router = useRouter();
  const { isLessonCompleted } = useUserStore();

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
      <View style={{ flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  const completedCount = lessons.filter((l) => isLessonCompleted(l.id)).length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <View style={{ padding: 24, paddingTop: 56 }}>
        {/* Voltar */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginBottom: 16 }}
        >
          <Text style={{ color: '#38bdf8', fontSize: 14, fontWeight: '600' }}>
            ← Voltar para Trilhas
          </Text>
        </TouchableOpacity>

        {/* Header da Trilha */}
        <Text style={{ color: '#f8fafc', fontSize: 26, fontWeight: 'bold', marginBottom: 6 }}>
          Golpes Pix e WhatsApp
        </Text>
        <Text style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>
          8 lições interativas baseadas em casos reais da Baixada Cuiabana
        </Text>

        {/* Card de Progresso */}
        <View style={{
          backgroundColor: '#1e293b',
          borderRadius: 16,
          padding: 16,
          marginBottom: 24,
          borderWidth: 1,
          borderColor: '#334155',
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: '#cbd5e1', fontSize: 13, fontWeight: '600' }}>
              Progresso da Trilha
            </Text>
            <Text style={{ color: '#3b82f6', fontSize: 13, fontWeight: 'bold' }}>
              {completedCount}/{lessons.length} Concluídas ({progressPercent}%)
            </Text>
          </View>
          <View style={{
            backgroundColor: '#0f172a',
            borderRadius: 99,
            height: 8,
            overflow: 'hidden',
          }}>
            <View style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: '#3b82f6',
              borderRadius: 99,
            }} />
          </View>
        </View>

        {/* Lista de Lições */}
        <Text style={{ color: '#64748b', fontSize: 12, fontWeight: 'bold', marginBottom: 12 }}>
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
                  backgroundColor: isCompleted ? '#064e3b20' : isUnlocked ? '#1e293b' : '#0f172a',
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: isCompleted ? '#059669' : isUnlocked ? '#3b82f660' : '#1e293b',
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
                  backgroundColor: isCompleted ? '#05966920' : isUnlocked ? '#1e3a5f' : '#1e293b',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 14,
                }}>
                  <Text style={{ fontSize: 18 }}>
                    {isCompleted ? '✅' : isUnlocked ? '▶️' : '🔒'}
                  </Text>
                </View>

                {/* Conteúdo */}
                <View style={{ flex: 1 }}>
                  <Text style={{
                    color: isUnlocked ? '#f8fafc' : '#64748b',
                    fontSize: 15,
                    fontWeight: 'bold',
                    marginBottom: 2,
                  }}>
                    {lesson.title}
                  </Text>
                  <Text style={{ color: '#f59e0b', fontSize: 12, fontWeight: '600' }}>
                    +{lesson.xpReward} XP
                  </Text>
                </View>

                {isCompleted && (
                  <View style={{
                    backgroundColor: '#059669',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 8,
                  }}>
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>Feito</Text>
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
