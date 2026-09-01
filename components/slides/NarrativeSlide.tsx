// components/slides/NarrativeSlide.tsx
import { View, Text } from 'react-native';
import type { NarrativeSlide as NarrativeSlideType } from '@/types';

interface Props {
  slide: NarrativeSlideType;
}

const CHARACTER_ICONS: Record<string, { emoji: string; name: string }> = {
  joao:       { emoji: '🧑', name: 'João' },
  dona_cida:  { emoji: '👩', name: 'Dona Cida' },
  carlos:     { emoji: '🧔', name: 'Carlos' },
  assistente: { emoji: '🛡️', name: 'Guia FinEdu' },
};

export default function NarrativeSlide({ slide }: Props) {
  const char = CHARACTER_ICONS[slide.character] ?? { emoji: '💬', name: 'Cenário' };

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      {/* Balão de Personagem */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#1e293b',
        padding: 12,
        borderRadius: 16,
        alignSelf: 'flex-start',
      }}>
        <Text style={{ fontSize: 32, marginRight: 10 }}>{char.emoji}</Text>
        <View>
          <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: 'bold' }}>PERSONAGEM</Text>
          <Text style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 'bold' }}>{char.name}</Text>
        </View>
      </View>

      {/* Caixa de Texto Narrativa */}
      <View style={{
        backgroundColor: '#1e293b',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: '#334155',
      }}>
        <Text style={{
          color: '#f8fafc',
          fontSize: 18,
          lineHeight: 28,
        }}>
          {slide.text}
        </Text>
      </View>
    </View>
  );
}
