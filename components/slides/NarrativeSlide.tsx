// components/slides/NarrativeSlide.tsx
import { View, Text } from 'react-native';
import type { NarrativeSlide as NarrativeSlideType } from '@/types';
import { useAppTheme } from '@/constants/theme';
import { useAutoRead } from '@/hooks/useSpeech';
import AccessibleText from '@/components/accessibility/AccessibleText';
import ListenButton from '@/components/accessibility/ListenButton';

interface Props {
  slide: NarrativeSlideType;
}

const CHARACTER_ICONS: Record<string, { emoji: string; name: string }> = {
  joao:       { emoji: '🧑', name: 'João' },
  dona_cida:  { emoji: '👩', name: 'Dona Cida' },
  carlos:     { emoji: '🧔', name: 'Carlos' },
  assistente: { emoji: '🛡️', name: 'Guia TchôEduca' },
};

export default function NarrativeSlide({ slide }: Props) {
  const { colors } = useAppTheme();
  const char = CHARACTER_ICONS[slide.character] ?? { emoji: '💬', name: 'Cenário' };
  const trimmed = slide.text.trim();
  // Evita repetir "João. João está..." quando o texto já começa com o nome do personagem
  const startsWithChar = trimmed.toLowerCase().startsWith(char.name.toLowerCase());
  const spokenText = startsWithChar ? trimmed : `${char.name}. ${trimmed}`;

  useAutoRead(spokenText);

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      {/* Balão de Personagem */}
      <View
        accessible
        accessibilityLabel={`Personagem: ${char.name}`}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 20,
          backgroundColor: colors.surface,
          padding: 12,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          alignSelf: 'flex-start',
        }}
      >
        <Text style={{ fontSize: 32, marginRight: 10 }} importantForAccessibility="no">
          {char.emoji}
        </Text>
        <View>
          <AccessibleText variant="caption" muted bold>PERSONAGEM</AccessibleText>
          <AccessibleText bold>{char.name}</AccessibleText>
        </View>
      </View>

      {/* Caixa de Texto Narrativa */}
      <View style={{
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: colors.border,
      }}>
        <AccessibleText>{slide.text}</AccessibleText>
      </View>

      <ListenButton text={spokenText} />
    </View>
  );
}
