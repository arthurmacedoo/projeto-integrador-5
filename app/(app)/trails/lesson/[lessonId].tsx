// app/(app)/trails/lesson/[lessonId].tsx
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getLesson } from '@/services/trail.service';
import { useUserStore } from '@/store/useUserStore';
import type { Lesson, Slide, DecisionOption, LevelUpResult } from '@/types';

import NarrativeSlide from '@/components/slides/NarrativeSlide';
import DecisionSlide from '@/components/slides/DecisionSlide';
import ConsequenceSlide from '@/components/slides/ConsequenceSlide';
import XPRewardSlide from '@/components/slides/XPRewardSlide';
import LevelUpModal from '@/components/gamification/LevelUpModal';

export default function LessonRunnerScreen() {
  const { trailId, lessonId } = useLocalSearchParams<{ trailId: string; lessonId: string }>();
  const router = useRouter();
  const { finishLesson } = useUserStore();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  // Estado da execução dos slides
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<DecisionOption | null>(null);
  const [levelUpData, setLevelUpData] = useState<LevelUpResult | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    async function load() {
      if (!trailId || !lessonId) return;
      try {
        const data = await getLesson(trailId, lessonId);
        setLesson(data);
      } catch (err) {
        console.error('Erro ao carregar lição:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [trailId, lessonId]);

  if (loading || !lesson) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  // Filtra slides dinamicamente baseado na escolha feita no decision slide
  // (Mostra apenas a consequência referente à opção escolhida)
  const activeSlides: Slide[] = [];
  for (const s of lesson.slides) {
    if (s.type === 'consequence') {
      if (selectedOption && s.forOption === selectedOption.id) {
        activeSlides.push(s);
      }
    } else {
      activeSlides.push(s);
    }
  }

  const currentSlide = activeSlides[slideIndex] ?? activeSlides[activeSlides.length - 1];
  const isLastSlide = slideIndex === activeSlides.length - 1;
  const isCorrect = selectedOption?.isCorrect ?? true;
  const xpEarned = isCorrect ? lesson.xpReward : Math.floor(lesson.xpReward * 0.5);

  async function handleNext() {
    // Se estiver no slide de decisão e não escolheu nada, impede avanço
    if (currentSlide.type === 'decision' && !selectedOption) {
      return;
    }

    if (isLastSlide && lesson) {
      // Conclui a lição e calcula XP / Level Up
      setFinishing(true);
      try {
        const levelUp = await finishLesson(lesson.id, lesson.xpReward, isCorrect);
        if (levelUp) {
          setLevelUpData(levelUp);
          setShowLevelUp(true);
        } else {
          router.back();
        }
      } catch (err) {
        console.error('Erro ao finalizar lição:', err);
        router.back();
      } finally {
        setFinishing(false);
      }
      return;
    }

    setSlideIndex((prev) => prev + 1);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <View style={{ flex: 1, padding: 24 }}>

        {/* Barra Superior com Progresso do Slide */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 14 }}>
            <Text style={{ color: '#94a3b8', fontSize: 18 }}>✕</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, backgroundColor: '#1e293b', height: 6, borderRadius: 99, overflow: 'hidden' }}>
            <View style={{
              width: `${Math.round(((slideIndex + 1) / activeSlides.length) * 100)}%`,
              height: '100%',
              backgroundColor: '#3b82f6',
              borderRadius: 99,
            }} />
          </View>
        </View>

        {/* Renderizador de Slides Dinâmico */}
        <View style={{ flex: 1 }}>
          {currentSlide.type === 'narrative' && (
            <NarrativeSlide slide={currentSlide} />
          )}

          {currentSlide.type === 'decision' && (
            <DecisionSlide
              slide={currentSlide}
              selectedOptionId={selectedOption?.id ?? null}
              onSelectOption={(opt) => setSelectedOption(opt)}
            />
          )}

          {currentSlide.type === 'consequence' && (
            <ConsequenceSlide slide={currentSlide} />
          )}

          {currentSlide.type === 'xp_reward' && (
            <XPRewardSlide xpEarned={xpEarned} isCorrect={isCorrect} />
          )}
        </View>

        {/* Botão de Avanço */}
        <TouchableOpacity
          onPress={handleNext}
          disabled={(currentSlide.type === 'decision' && !selectedOption) || finishing}
          style={{
            backgroundColor:
              currentSlide.type === 'decision' && !selectedOption ? '#1e293b' : '#3b82f6',
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: 'center',
            opacity: currentSlide.type === 'decision' && !selectedOption ? 0.5 : 1,
            marginTop: 16,
          }}
        >
          {finishing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
              {isLastSlide ? 'Finalizar Lição 🏆' : 'Continuar ➔'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Modal de Level Up */}
        <LevelUpModal
          visible={showLevelUp}
          levelUpData={levelUpData}
          onDismiss={() => {
            setShowLevelUp(false);
            router.back();
          }}
        />
      </View>
    </SafeAreaView>
  );
}
