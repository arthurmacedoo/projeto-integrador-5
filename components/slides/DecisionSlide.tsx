// ──────────────────────────────────────────────────────────────
// components/slides/DecisionSlide.tsx
// Slide 2 de 4 · Sua decisão (Idêntico à Tela 11 do PDF FinEdu)
// ──────────────────────────────────────────────────────────────
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import type { DecisionSlide as DecisionSlideType, DecisionOption } from '@/types';
import { AvatarPortrait, IconCheck } from '@/components/ui/FinEduIcons';

interface Props {
  slide: DecisionSlideType;
  selectedOptionId: string | null;
  onSelectOption: (option: DecisionOption) => void;
}

export default function DecisionSlide({
  slide,
  selectedOptionId,
  onSelectOption,
}: Props) {
  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 12 }}
    >
      {/* Pergunta Principal */}
      <Text className="text-ink text-2xl font-extrabold leading-tight mb-3.5">
        {slide.question}
      </Text>

      {/* Card de Resumo do Cenário com Avatar do João */}
      <View
        style={{ backgroundColor: '#EFECE4' }}
        className="rounded-2xl p-3 flex-row items-center mb-4"
      >
        <View className="mr-3">
          <AvatarPortrait id="joao" size={38} />
        </View>
        <Text className="text-ink text-xs flex-1 leading-relaxed">
          Um fone de R$ 299 por R$ 49. Só por Pix, com prazo até as 18h.
        </Text>
      </View>

      <Text className="text-ink-muted text-xs mb-3">
        Escolha uma opção para continuar.
      </Text>

      {/* Lista de Opções A / B / C */}
      <View className="gap-3">
        {slide.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              onPress={() => onSelectOption(opt)}
              activeOpacity={0.85}
              style={{
                backgroundColor: isSelected ? '#EDF4E4' : '#FFFFFF',
                borderColor: isSelected ? '#1A4731' : '#E3DFD3',
                borderWidth: isSelected ? 2 : 1,
              }}
              className="rounded-2xl p-4 flex-row items-start"
            >
              {/* Indicador A/B/C ou Check */}
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: isSelected ? '#1A4731' : '#EFECE4',
                }}
                className="items-center justify-center mr-3 mt-0.5"
              >
                {isSelected ? (
                  <IconCheck size={14} color="#FFFFFF" />
                ) : (
                  <Text className="text-ink font-extrabold text-xs">
                    {opt.id}
                  </Text>
                )}
              </View>

              {/* Texto da Opção */}
              <View className="flex-1">
                <Text
                  className={`text-xs leading-snug ${
                    isSelected ? 'text-ink font-extrabold' : 'text-ink font-semibold'
                  }`}
                >
                  {opt.text}
                </Text>
                {isSelected && (
                  <Text
                    style={{ color: '#1A4731' }}
                    className="text-[11px] font-bold mt-1"
                  >
                    Selecionada
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
