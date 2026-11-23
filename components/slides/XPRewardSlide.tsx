// components/slides/XPRewardSlide.tsx
import { View, Text } from 'react-native';
import { useAppTheme } from '@/constants/theme';
import { useAutoRead } from '@/hooks/useSpeech';
import AccessibleText from '@/components/accessibility/AccessibleText';
import ListenButton from '@/components/accessibility/ListenButton';

interface Props {
  xpEarned: number;
  isCorrect: boolean;
  alreadyCompleted?: boolean;
}

export default function XPRewardSlide({ xpEarned, isCorrect, alreadyCompleted = false }: Props) {
  const { colors } = useAppTheme();
  const title = alreadyCompleted
    ? 'Lição Revisada!'
    : isCorrect
      ? 'Lição Concluída com Sucesso!'
      : 'Lição Finalizada!';
  const message = alreadyCompleted
    ? 'Excelente revisão! Você já conquistou o XP desta lição anteriormente.'
    : isCorrect
      ? 'Você tomou a decisão certa e protegeu seu patrimônio!'
      : 'Errar faz parte do aprendizado. O importante é estar preparado na vida real!';

  const spokenText = alreadyCompleted
    ? `${title} ${message}`
    : `${title} ${message} Você ganhou ${xpEarned} pontos de experiência.`;

  useAutoRead(spokenText);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 64, marginBottom: 16 }} importantForAccessibility="no">
        {alreadyCompleted ? '🔄' : isCorrect ? '🏆' : '📚'}
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
        accessibilityLabel={
          alreadyCompleted
            ? 'Lição revisada, XP já conquistado anteriormente'
            : `Recompensa: mais ${xpEarned} pontos de experiência`
        }
        style={{
          backgroundColor: colors.surface,
          borderRadius: 24,
          paddingVertical: 20,
          paddingHorizontal: 36,
          alignItems: 'center',
          borderWidth: 2,
          borderColor: alreadyCompleted ? colors.primary : colors.warningBase,
        }}
      >
        <AccessibleText
          variant="caption"
          bold
          style={{ color: alreadyCompleted ? colors.primaryText : colors.warning, marginBottom: 4 }}
        >
          {alreadyCompleted ? 'REVISÃO CONCLUÍDA' : 'XP RECOMPENSA'}
        </AccessibleText>
        <Text
          style={{
            color: alreadyCompleted ? colors.primaryText : colors.warning,
            fontSize: alreadyCompleted ? 24 : 40,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {alreadyCompleted ? 'XP já conquistado' : `+${xpEarned} XP`}
        </Text>
      </View>

      <View style={{ alignSelf: 'center' }}>
        <ListenButton text={spokenText} />
      </View>
    </View>
  );
}
