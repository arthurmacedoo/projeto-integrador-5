// components/accessibility/ListenButton.tsx
// Botão "🔊 Ouvir" que lê o texto em voz alta. Tocar de novo para a leitura.
import { TouchableOpacity } from 'react-native';
import { useSpeech } from '@/hooks/useSpeech';
import { useAppTheme } from '@/constants/theme';
import AccessibleText from './AccessibleText';

interface Props {
  text: string;
}

export default function ListenButton({ text }: Props) {
  const { speak, stop, isSpeaking } = useSpeech(text);
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={() => (isSpeaking ? stop() : speak(text))}
      accessibilityRole="button"
      accessibilityLabel={isSpeaking ? 'Parar leitura em voz alta' : 'Ouvir este texto em voz alta'}
      hitSlop={8}
      style={{
        alignSelf: 'flex-start',
        minHeight: 48, // área de toque mínima recomendada (48dp)
        paddingHorizontal: 16,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: colors.primary,
        backgroundColor: isSpeaking ? colors.primary : 'transparent',
        justifyContent: 'center',
        marginTop: 16,
      }}
    >
      <AccessibleText
        variant="caption"
        bold
        style={{ color: isSpeaking ? colors.onPrimary : colors.primaryText }}
      >
        {isSpeaking ? '⏹  Parar' : '🔊  Ouvir'}
      </AccessibleText>
    </TouchableOpacity>
  );
}
