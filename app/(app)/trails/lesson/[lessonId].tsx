// ──────────────────────────────────────────────────────────────
// app/(app)/trails/lesson/[lessonId].tsx
// Engine de Lição Interativa — 4 Passos (Telas 10 a 14 do PDF FinEdu)
// ──────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getLesson } from '@/services/trail.service';
import { useUserStore } from '@/store/useUserStore';
import { getLevelForXP } from '@/constants/levels';
import type { Lesson, Slide, DecisionOption, LevelUpResult } from '@/types';
import { IconSparkle, IconCheck } from '@/components/ui/FinEduIcons';

import NarrativeSlide from '@/components/slides/NarrativeSlide';
import DecisionSlide from '@/components/slides/DecisionSlide';
import ConsequenceSlide from '@/components/slides/ConsequenceSlide';
import XPRewardSlide from '@/components/slides/XPRewardSlide';
import LevelUpModal from '@/components/gamification/LevelUpModal';

const FALLBACK_LESSON: Lesson = {
  id: 'lesson_03',
  trailId: 'trail_golpes',
  title: 'A Promoção Imperdível',
  order: 3,
  xpReward: 60,
  slides: [
    {
      type: 'narrative',
      character: 'joao',
      text: 'Depois do trabalho, João vê um anúncio de fone sem fio por um preço muito abaixo do normal. A loja pede pagamento só por Pix.',
      background: 'phone_screen',
    },
    {
      type: 'decision',
      question: 'O que João deve fazer antes de pagar?',
      options: [
        {
          id: 'A',
          text: 'Pagar logo por Pix para não perder o desconto.',
          isCorrect: false,
        },
        {
          id: 'B',
          text: 'Verificar a loja por canais independentes antes de pagar.',
          isCorrect: true,
        },
        {
          id: 'C',
          text: 'Confiar só nos depoimentos do anúncio e fazer o Pix.',
          isCorrect: false,
        },
      ],
    },
    {
      type: 'consequence',
      forOption: 'A',
      isNegative: true,
      text: 'Nesta simulação, a oferta era falsa. Pagar por Pix sem verificar a loja colocaria o dinheiro de João em risco, sem garantia de receber o fone.',
      tip: 'Confira a loja em fontes independentes. Não se baseie só nos depoimentos que ela mesma publicou.',
    },
    {
      type: 'consequence',
      forOption: 'B',
      isNegative: false,
      text: 'João pesquisou a loja fora do anúncio e encontrou sinais de fraude. Ao não pagar nem enviar dados, protegeu seu dinheiro e suas informações.',
      tip: 'Pesquise a reputação da loja em fontes independentes. Confira os canais oficiais por conta própria, sem usar os contatos do anúncio.',
    },
    {
      type: 'consequence',
      forOption: 'C',
      isNegative: true,
      text: 'Nesta simulação, os comentários foram criados pelos próprios golpistas. Fazer o Pix sem checar fontes externas colocaria o dinheiro de João em risco.',
      tip: 'Confira a loja em fontes independentes. Não se baseie só nos depoimentos que ela mesma publicou.',
    },
    {
      type: 'xp_reward',
    },
  ],
};

export default function LessonRunnerScreen() {
  const { trailId, lessonId } = useLocalSearchParams<{
    trailId: string;
    lessonId: string;
  }>();
  const router = useRouter();
  const { finishLesson } = useUserStore();

  const [lesson, setLesson] = useState<Lesson>(FALLBACK_LESSON);
  const [loading, setLoading] = useState(false);

  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<DecisionOption | null>(
    null
  );
  const [levelUpData, setLevelUpData] = useState<LevelUpResult | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    async function load() {
      if (!trailId || !lessonId || lessonId === 'lesson_03') {
        setLesson(FALLBACK_LESSON);
        return;
      }
      try {
        const data = await Promise.race([
          getLesson(trailId, lessonId),
          new Promise<Lesson | null>((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 1200)
          ),
        ]);
        if (data) {
          setLesson(data);
        }
      } catch {
        setLesson({ ...FALLBACK_LESSON, id: lessonId });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [trailId, lessonId]);

  if (loading || !lesson) {
    return (
      <View
        style={{ flex: 1, backgroundColor: '#F7F6F0' }}
        className="justify-center items-center"
      >
        <ActivityIndicator size="large" color="#1A4731" />
      </View>
    );
  }

  // Filtra slides dinamicamente baseado na escolha feita no decision slide
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

  const currentSlide =
    activeSlides[slideIndex] ?? activeSlides[activeSlides.length - 1];
  const isLastSlide = slideIndex === activeSlides.length - 1;
  const isCorrect = selectedOption?.isCorrect ?? true;
  const xpEarned = isCorrect
    ? lesson.xpReward
    : Math.floor(lesson.xpReward * 0.5);

  const totalSteps = 4;
  const currentStepNumber = Math.min(slideIndex + 1, totalSteps);
  const lessonOrder = lesson.order ?? 3;
  const progressPercent = Math.round((currentStepNumber / totalSteps) * 100);

  function getStepTitle(slide: Slide): string {
    if (slide.type === 'narrative') return '1 de 4 · A história';
    if (slide.type === 'decision') return '2 de 4 · Sua decisão';
    if (slide.type === 'consequence') {
      return slide.isNegative
        ? '4 de 4 · Aprendizado e XP'
        : '3 de 4 · A consequência';
    }
    return '4 de 4 · Aprendizado e XP';
  }

  function getButtonLabel(slide: Slide): string {
    if (slide.type === 'decision') return 'Confirmar escolha';
    if (slide.type === 'consequence' && slide.isNegative) {
      return 'Continuar na trilha';
    }
    return 'Continuar';
  }

  function getFooterCaption(slide: Slide): string | null {
    if (slide.type === 'decision') {
      return 'Aprender faz parte. Sua jornada continua em qualquer escolha.';
    }
    if (slide.type === 'consequence' && slide.isNegative) {
      return 'A lição foi concluída. Seu aprendizado continua.';
    }
    if (slide.type === 'xp_reward') {
      return 'XP recebido uma única vez por lição.';
    }
    return null;
  }

  async function handleNext() {
    if (currentSlide.type === 'decision' && !selectedOption) {
      return;
    }

    if (isLastSlide && lesson) {
      setFinishing(true);
      const prevLevel = useUserStore.getState().level;
      try {
        const result = await Promise.race([
          finishLesson(lesson.id, lesson.xpReward, isCorrect),
          new Promise<LevelUpResult | null>((resolve) =>
            setTimeout(() => resolve(null), 600)
          ),
        ]);

        const afterState = useUserStore.getState();
        const computedLevel = getLevelForXP(afterState.xp);

        const finalLevelUp: LevelUpResult | null =
          result ??
          (computedLevel.level > prevLevel
            ? {
                previousLevel: prevLevel,
                newLevel: computedLevel.level,
                newAvatarVariant: computedLevel.avatarVariantUnlocked,
                levelName: computedLevel.name,
              }
            : null);

        if (finalLevelUp) {
          setLevelUpData(finalLevelUp);
          setShowLevelUp(true);
        } else {
          router.back();
        }
      } catch {
        router.back();
      } finally {
        setFinishing(false);
      }
      return;
    }

    setSlideIndex((prev) => prev + 1);
  }

  const isDecisionDisabled =
    currentSlide.type === 'decision' && !selectedOption;
  const footerCaption = getFooterCaption(currentSlide);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F6F0' }}>
      <View className="flex-1 px-6 pt-8 pb-6 justify-between">
        {/* Topo: Fechar + LIÇÃO X DE 8 + Badge XP */}
        <View className="mb-4">
          {currentSlide.type === 'xp_reward' ? (
            <View className="flex-row items-center justify-between mb-3">
              <View
                style={{ backgroundColor: '#E5ECD8' }}
                className="px-3 py-1 rounded-md flex-row items-center"
              >
                <View className="mr-1.5">
                  <IconCheck size={12} color="#1A4731" />
                </View>
                <Text
                  style={{ color: '#1A4731' }}
                  className="text-[10px] font-extrabold tracking-wider uppercase"
                >
                  LIÇÃO {lessonOrder} CONCLUÍDA
                </Text>
              </View>
              <Text className="text-ink-muted text-xs font-semibold">
                4 de 4
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={{ backgroundColor: '#EFECE4' }}
                  className="w-8 h-8 rounded-full items-center justify-center mr-2.5"
                >
                  <Text className="text-ink text-xs font-bold">✕</Text>
                </TouchableOpacity>
                <Text className="text-ink text-xs font-extrabold tracking-wider uppercase">
                  LIÇÃO {lessonOrder} DE 8
                </Text>
              </View>

              <View
                style={{ backgroundColor: '#D9ECAE' }}
                className="px-2.5 py-1 rounded-full flex-row items-center"
              >
                <View className="mr-1">
                  <IconSparkle size={12} color="#1A4731" />
                </View>
                <Text
                  style={{ color: '#1A4731' }}
                  className="text-[11px] font-extrabold"
                >
                  {lesson.xpReward} XP
                </Text>
              </View>
            </View>
          )}

          {/* Barra de Progresso Contínua */}
          <View
            style={{ backgroundColor: '#E3DFD3' }}
            className="rounded-full h-1.5 overflow-hidden mb-2"
          >
            <View
              style={{
                width: `${progressPercent}%`,
                backgroundColor: '#1A4731',
              }}
              className="h-full rounded-full"
            />
          </View>

          {currentSlide.type !== 'xp_reward' && (
            <Text className="text-ink-muted text-xs">
              {getStepTitle(currentSlide)}
            </Text>
          )}
        </View>

        {/* Conteúdo Dinâmico do Slide */}
        <View className="flex-1">
          {currentSlide.type === 'narrative' && (
            <NarrativeSlide
              slide={currentSlide}
              lessonTitle={lesson.title}
            />
          )}

          {currentSlide.type === 'decision' && (
            <DecisionSlide
              slide={currentSlide}
              selectedOptionId={selectedOption?.id ?? null}
              onSelectOption={(opt) => setSelectedOption(opt)}
            />
          )}

          {currentSlide.type === 'consequence' && (
            <ConsequenceSlide
              slide={currentSlide}
              baseXP={lesson.xpReward}
            />
          )}

          {currentSlide.type === 'xp_reward' && (
            <XPRewardSlide
              xpEarned={xpEarned}
              isCorrect={isCorrect}
              lessonTitle={lesson.title}
              lessonId={lesson.id}
            />
          )}
        </View>

        {/* Rodapé com Botão Pílula */}
        <View className="mt-3">
          <TouchableOpacity
            onPress={handleNext}
            disabled={isDecisionDisabled || finishing}
            activeOpacity={0.85}
            style={{ backgroundColor: '#1A4731' }}
            className={`w-full rounded-full py-4 px-6 flex-row items-center justify-center ${
              isDecisionDisabled || finishing ? 'opacity-45' : 'opacity-100'
            }`}
          >
            {finishing ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Text className="text-white font-bold text-sm mr-2">
                  {getButtonLabel(currentSlide)}
                </Text>
                {currentSlide.type !== 'decision' && (
                  <Text className="text-white font-bold text-sm">→</Text>
                )}
              </>
            )}
          </TouchableOpacity>

          {footerCaption && (
            <Text className="text-ink-muted text-[11px] text-center mt-2">
              {footerCaption}
            </Text>
          )}
        </View>

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
