// app/(app)/trails/lesson/[lessonId].tsx
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
// Área segura (notch/barra de status) em Android e iOS; o SafeAreaView do react-native só funcionava no iOS
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getLesson } from '@/services/trail.service';
import { useUserStore } from '@/store/useUserStore';
import type { Lesson, Slide, DecisionOption, LevelUpResult } from '@/types';

import NarrativeSlide from '@/components/slides/NarrativeSlide';
import DecisionSlide from '@/components/slides/DecisionSlide';
import ConsequenceSlide from '@/components/slides/ConsequenceSlide';
import XPRewardSlide from '@/components/slides/XPRewardSlide';
import LevelUpModal from '@/components/gamification/LevelUpModal';
import { useAppTheme } from '@/constants/theme';

export default function LessonRunnerScreen() {
  const { trailId, lessonId } = useLocalSearchParams<{ trailId: string; lessonId: string }>();
  const router = useRouter();
  const finishLesson = useUserStore((s) => s.finishLesson);
  const { colors, fontSize, highContrast } = useAppTheme();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  // Estado da execução dos slides
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<DecisionOption | null>(null);
  const [levelUpData, setLevelUpData] = useState<LevelUpResult | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [wasCompletedOnOpen, setWasCompletedOnOpen] = useState(false);

  function navigateBackToTrail() {
    if (trailId) {
      router.replace({
        pathname: '/(app)/trails/[trailId]',
        params: { trailId },
      } as any);
    } else {
      router.back();
    }
  }

  useEffect(() => {
    async function load() {
      if (!lessonId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setSlideIndex(0);
      setSelectedOption(null);
      setLevelUpData(null);
      setShowLevelUp(false);
      setWasCompletedOnOpen(useUserStore.getState().isLessonCompleted(lessonId));
      try {
        // trailId pode faltar se a página for recarregada com um link incompleto
        const data = await getLesson(trailId ?? 'trail_golpes', lessonId);
        setLesson(data);
      } catch (err) {
        console.error('Erro ao carregar lição:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [trailId, lessonId]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} accessibilityLabel="Carregando lição" />
      </View>
    );
  }

  // Lição não encontrada (ID inválido no link): antes ficava carregando para sempre
  if (!lesson) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text style={{ color: colors.text, fontSize: fontSize('title'), fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
          Lição não encontrada
        </Text>
        <TouchableOpacity
          onPress={navigateBackToTrail}
          accessibilityRole="button"
          style={{ backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 24 }}
        >
          <Text style={{ color: colors.onPrimary, fontWeight: 'bold', fontSize: fontSize('body') }}>Voltar para a trilha</Text>
        </TouchableOpacity>
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
          navigateBackToTrail();
        }
      } catch (err) {
        console.error('Erro ao finalizar lição:', err);
        navigateBackToTrail();
      } finally {
        setFinishing(false);
      }
      return;
    }

    setSlideIndex((prev) => prev + 1);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, padding: 24 }}>

        {/* Barra Superior com Progresso do Slide */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
          <TouchableOpacity
            onPress={navigateBackToTrail}
            accessibilityRole="button"
            accessibilityLabel="Sair da lição"
            hitSlop={12}
            style={{ marginRight: 14, minWidth: 48, minHeight: 48, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text style={{ color: colors.textMuted, fontSize: 22 }}>✕</Text>
          </TouchableOpacity>
          <View
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel={`Slide ${slideIndex + 1} de ${activeSlides.length}`}
            style={{ flex: 1, backgroundColor: colors.surface, height: 6, borderRadius: 99, overflow: 'hidden', borderWidth: highContrast ? 1 : 0, borderColor: colors.border }}
          >
            <View style={{
              width: `${Math.round(((slideIndex + 1) / activeSlides.length) * 100)}%`,
              height: '100%',
              backgroundColor: colors.primary,
              borderRadius: 99,
            }} />
          </View>
        </View>

        {/* Renderizador de Slides Dinâmico
            key={slideIndex} força recriar o slide a cada avanço — assim a leitura
            em voz alta do slide anterior para e a do novo começa do zero. */}
        <ScrollView key={slideIndex} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
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
            <XPRewardSlide
              xpEarned={xpEarned}
              isCorrect={isCorrect}
              alreadyCompleted={wasCompletedOnOpen}
            />
          )}
        </ScrollView>

        {/* Botão de Avanço */}
        {(() => {
          const isDecisionPending = currentSlide.type === 'decision' && !selectedOption;
          const isDisabled = isDecisionPending || finishing;
          return (
            <TouchableOpacity
              onPress={handleNext}
              disabled={isDisabled}
              accessibilityRole="button"
              accessibilityLabel={isLastSlide ? 'Finalizar lição' : 'Continuar'}
              accessibilityHint={isDecisionPending ? 'Escolha uma opção primeiro' : undefined}
              accessibilityState={{ disabled: isDisabled }}
              aria-disabled={isDisabled}
              style={{
                backgroundColor: isDecisionPending ? colors.surface : colors.primary,
                borderRadius: 16,
                borderWidth: isDecisionPending && highContrast ? 2 : 0,
                borderColor: colors.border,
                paddingVertical: 18,
                alignItems: 'center',
                opacity: isDecisionPending ? (highContrast ? 0.85 : 0.65) : 1,
                marginTop: 16,
              }}
            >
              {finishing ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text
                  maxFontSizeMultiplier={1.4}
                  style={{
                    color: isDecisionPending ? colors.textMuted : colors.onPrimary,
                    fontWeight: 'bold',
                    fontSize: fontSize('body'),
                  }}
                >
                  {isLastSlide ? 'Finalizar Lição 🏆' : 'Continuar ➔'}
                </Text>
              )}
            </TouchableOpacity>
          );
        })()}

        {/* Modal de Level Up */}
        <LevelUpModal
          visible={showLevelUp}
          levelUpData={levelUpData}
          onDismiss={() => {
            setShowLevelUp(false);
            navigateBackToTrail();
          }}
        />
      </View>
    </SafeAreaView>
  );
}
