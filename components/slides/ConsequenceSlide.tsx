// components/slides/ConsequenceSlide.tsx
import { View, Text } from 'react-native';
import type { ConsequenceSlide as ConsequenceSlideType } from '@/types';

interface Props {
  slide: ConsequenceSlideType;
}

export default function ConsequenceSlide({ slide }: Props) {
  const isNegative = slide.isNegative;

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      {/* Badge de Resultado */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: isNegative ? '#ef444420' : '#22c55e20',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
        alignSelf: 'flex-start',
      }}>
        <Text style={{ fontSize: 20, marginRight: 8 }}>
          {isNegative ? '⚠️' : '🎉'}
        </Text>
        <Text style={{
          color: isNegative ? '#f87171' : '#4ade80',
          fontSize: 14,
          fontWeight: 'bold',
        }}>
          {isNegative ? 'CUIDADO: DECISÃO ARRISCADA' : 'EXCELENTE DECISÃO!'}
        </Text>
      </View>

      {/* Card da Consequência */}
      <View style={{
        backgroundColor: '#1e293b',
        borderRadius: 20,
        padding: 22,
        borderWidth: 1,
        borderColor: isNegative ? '#ef444450' : '#22c55e50',
        marginBottom: 20,
      }}>
        <Text style={{
          color: '#f8fafc',
          fontSize: 17,
          lineHeight: 26,
        }}>
          {slide.text}
        </Text>
      </View>

      {/* Dica de Ouro do Mascote */}
      {slide.tip && (
        <View style={{
          backgroundColor: '#0f172a',
          borderRadius: 16,
          padding: 16,
          borderLeftWidth: 4,
          borderLeftColor: '#3b82f6',
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ fontSize: 16, marginRight: 6 }}>💡</Text>
            <Text style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: 12 }}>
              DICA DO GUARDIÃO
            </Text>
          </View>
          <Text style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 20 }}>
            {slide.tip}
          </Text>
        </View>
      )}
    </View>
  );
}
