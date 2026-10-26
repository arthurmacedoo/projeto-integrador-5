// components/slides/DecisionSlide.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import type { DecisionSlide as DecisionSlideType, DecisionOption } from '@/types';

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
    <View style={{ flex: 1, justifyContent: 'center' }}>
      {/* Título de Decisão */}
      <View style={{
        backgroundColor: '#3b82f620',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 12,
      }}>
        <Text style={{ color: '#60a5fa', fontWeight: 'bold', fontSize: 12 }}>
          SUA VEZ DE DECIDIR 💡
        </Text>
      </View>

      <Text style={{
        color: '#f8fafc',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 24,
        lineHeight: 28,
      }}>
        {slide.question}
      </Text>

      {/* Opções de Escolha */}
      <View style={{ gap: 12 }}>
        {slide.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              onPress={() => onSelectOption(opt)}
              style={{
                backgroundColor: isSelected ? '#1e3a5f' : '#1e293b',
                padding: 18,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: isSelected ? '#3b82f6' : '#334155',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: isSelected ? '#3b82f6' : '#0f172a',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 14,
              }}>
                <Text style={{
                  color: isSelected ? '#fff' : '#94a3b8',
                  fontWeight: 'bold',
                  fontSize: 14,
                }}>
                  {opt.id}
                </Text>
              </View>
              <Text style={{
                color: isSelected ? '#f8fafc' : '#cbd5e1',
                fontSize: 15,
                flex: 1,
                lineHeight: 22,
                fontWeight: isSelected ? '600' : 'normal',
              }}>
                {opt.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
