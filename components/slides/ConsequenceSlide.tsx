// ──────────────────────────────────────────────────────────────
// components/slides/ConsequenceSlide.tsx
// Slide 3 de 4 / 4 de 4 · Consequência (Telas 12 e 13 do PDF FinEdu)
// ──────────────────────────────────────────────────────────────
import { View, Text, ScrollView } from 'react-native';
import type { ConsequenceSlide as ConsequenceSlideType } from '@/types';
import {
  ShieldHeroIllustration,
  AvatarPortrait,
  IconCheck,
  IconLightbulb,
} from '@/components/ui/FinEduIcons';

interface Props {
  slide: ConsequenceSlideType;
  baseXP?: number;
}

export default function ConsequenceSlide({ slide, baseXP = 60 }: Props) {
  const isNegative = slide.isNegative;
  const partialXP = Math.floor(baseXP * 0.5);

  if (!isNegative) {
    // ── TELA 12: BOA ESCOLHA! ──
    return (
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 12 }}
      >
        {/* Banner com Ilustração do Escudo */}
        <View
          style={{ backgroundColor: '#EFECE4' }}
          className="rounded-3xl py-4 items-center justify-center mb-4 overflow-hidden"
        >
          <ShieldHeroIllustration variant="check" compact />
        </View>

        <View
          style={{ backgroundColor: '#E5ECD8' }}
          className="rounded-md px-2.5 py-1 self-start flex-row items-center mb-2.5"
        >
          <View className="mr-1.5">
            <IconCheck size={12} color="#1A4731" />
          </View>
          <Text
            style={{ color: '#1A4731' }}
            className="text-[10px] font-extrabold tracking-wider uppercase"
          >
            BOA ESCOLHA!
          </Text>
        </View>

        <Text className="text-ink text-2xl font-extrabold leading-tight mb-3">
          Uma pausa protege muita coisa.
        </Text>

        <Text className="text-ink text-xs leading-relaxed mb-3">
          {slide.text}
        </Text>

        <Text className="text-ink-muted text-xs leading-relaxed mb-4">
          Preço irreal e urgência são alertas. Os depoimentos do próprio anúncio podem ser falsos.
        </Text>

        {/* Card: Leve para a vida */}
        {slide.tip && (
          <View
            style={{
              backgroundColor: '#E5ECD8',
              borderColor: '#C8DDB0',
              borderWidth: 1,
            }}
            className="rounded-2xl p-4"
          >
            <View className="flex-row items-center mb-1.5">
              <View className="mr-1.5">
                <IconLightbulb size={15} color="#1A4731" />
              </View>
              <Text
                style={{ color: '#1A4731' }}
                className="font-extrabold text-xs"
              >
                Leve para a vida
              </Text>
            </View>
            <Text className="text-ink text-xs leading-relaxed">
              {slide.tip}
            </Text>
          </View>
        )}
      </ScrollView>
    );
  }

  // ── TELA 13: OUTRA ESCOLHA · PAGAR LOGO ("Tudo bem errar por aqui.") ──
  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 12 }}
    >
      <View
        style={{ backgroundColor: '#EFECE4' }}
        className="rounded-md px-2.5 py-1 self-start mb-3"
      >
        <Text className="text-ink-muted text-[10px] font-extrabold tracking-wider uppercase">
          OUTRA ESCOLHA · PAGAR LOGO
        </Text>
      </View>

      {/* Banner terracota suave com avatar do João */}
      <View
        style={{
          backgroundColor: '#F6E5DA',
          borderColor: '#E8C5B0',
          borderWidth: 1,
        }}
        className="rounded-2xl p-3.5 flex-row items-center mb-4"
      >
        <View className="mr-3.5">
          <AvatarPortrait id="joao" size={52} />
        </View>
        <View className="flex-1">
          <Text style={{ color: '#8A3B1E' }} className="text-sm mb-0.5">
            ✋
          </Text>
          <Text
            style={{ color: '#7C2D12' }}
            className="font-extrabold text-xs leading-snug"
          >
            A pressa pode esconder sinais.
          </Text>
        </View>
      </View>

      <Text className="text-ink text-2xl font-extrabold leading-tight mb-3">
        Tudo bem errar por aqui.
      </Text>

      <Text className="text-ink text-xs leading-relaxed mb-2.5">
        {slide.text}
      </Text>
      <Text className="text-ink-muted text-xs leading-relaxed mb-4">
        Golpistas usam urgência e preços muito baixos para apressar decisões. Isso não é culpa de quem é enganado.
      </Text>

      {slide.tip && (
        <View
          style={{
            backgroundColor: '#E5ECD8',
            borderColor: '#C8DDB0',
            borderWidth: 1,
          }}
          className="rounded-2xl p-4 mb-3.5"
        >
          <Text
            style={{ color: '#1A4731' }}
            className="font-extrabold text-xs mb-1"
          >
            Na próxima, faça uma pausa.
          </Text>
          <Text className="text-ink text-xs leading-relaxed">
            {slide.tip}
          </Text>
        </View>
      )}

      {/* Preview de XP parcial (50%) */}
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: '#E3DFD3',
          borderWidth: 1,
        }}
        className="rounded-2xl p-3.5 flex-row items-center"
      >
        <Text
          style={{ color: '#1A4731' }}
          className="font-extrabold text-lg mr-3"
        >
          +{partialXP} XP
        </Text>
        <Text className="text-ink-muted text-xs flex-1 leading-snug">
          50% dos {baseXP} XP. A lição conta e você avança.
        </Text>
      </View>
    </ScrollView>
  );
}
