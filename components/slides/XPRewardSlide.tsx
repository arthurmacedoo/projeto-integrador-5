// components/slides/XPRewardSlide.tsx
import { View, Text } from 'react-native';
import { useAppTheme } from '@/constants/theme';
import { useAutoRead } from '@/hooks/useSpeech';
import AccessibleText from '@/components/accessibility/AccessibleText';

interface Props {
  xpEarned: number;
  isCorrect: boolean;
}

export default function XPRewardSlide({ xpEarned, isCorrect }: Props) {
  const { colors, highContrast } = useAppTheme();
  const title = isCorrect ? 'Lição Concluída com Sucesso!' : 'Lição Finalizada!';
  const message = isCorrect
    ? 'Você tomou a decisão certa e protegeu seu patrimônio!'
    : 'Errar faz parte do aprendizado. O importante é estar preparado na vida real!';

  useAutoRead(`${title} ${message} Você ganhou ${xpEarned} pontos de experiência.`);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 64, marginBottom: 16 }} importantForAccessibility="no">
        {isCorrect ? '🏆' : '📚'}
      </Text>

      <AccessibleText
        variant="heading"
        accessibilityRole="header"
        style={{ marginBottom: 8, textAlign: 'center' }}
      >
        {title}
      </AccessibleText>

      <AccessibleText muted style={{ marginBottom: 32, textAlign: 'center', paddingHorizontal: 20 }}>
        {message}
      </AccessibleText>

      {/* Badge de Recompensa de XP */}
      <View
        accessible
        accessibilityLabel={`Recompensa: mais ${xpEarned} pontos de experiência`}
        style={{
          backgroundColor: colors.surface,
          borderRadius: 24,
          paddingVertical: 20,
          paddingHorizontal: 36,
          alignItems: 'center',
          borderWidth: 2,
          borderColor: colors.warningBase,
        }}
      >
        <AccessibleText variant="caption" bold style={{ color: colors.warning, marginBottom: 4 }}>
          XP RECOMPENSA
        </AccessibleText>
        <Text style={{ color: colors.warning, fontSize: 40, fontWeight: 'bold' }}>
          +{xpEarned} XP
        </Text>
      </View>
    </View>
  );
}
