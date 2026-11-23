// components/slides/ConsequenceSlide.tsx
import { View, Text } from 'react-native';
import type { ConsequenceSlide as ConsequenceSlideType } from '@/types';
import { useAppTheme } from '@/constants/theme';
import { useAutoRead } from '@/hooks/useSpeech';
import AccessibleText from '@/components/accessibility/AccessibleText';
import ListenButton from '@/components/accessibility/ListenButton';

interface Props {
  slide: ConsequenceSlideType;
}

export default function ConsequenceSlide({ slide }: Props) {
  const { colors, highContrast } = useAppTheme();
  const isNegative = slide.isNegative;
  const statusColor = isNegative ? colors.danger : colors.success;
  const statusLabel = isNegative ? 'CUIDADO: DECISÃO ARRISCADA' : 'EXCELENTE DECISÃO!';

  const trimmed = slide.text.trim();
  // Evita repetir "Excelente decisão! Excelente decisão!" ou "Cuidado... Cuidado..."
  const alreadyHasLead = isNegative
    ? /^cuidado\b/i.test(trimmed)
    : /^excelente\b/i.test(trimmed);
  const lead = alreadyHasLead
    ? ''
    : isNegative
      ? 'Cuidado, decisão arriscada. '
      : 'Excelente decisão! ';
  const spokenText = `${lead}${trimmed}${slide.tip ? ` Dica do Guardião: ${slide.tip}` : ''}`;

  useAutoRead(spokenText);

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      {/* Badge de Resultado (texto + ícone, não só cor — acessível p/ daltônicos) */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: highContrast ? 'transparent' : (isNegative ? colors.dangerSoft : '#22c55e20'),
        borderWidth: highContrast ? 2 : 0,
        borderColor: statusColor,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
        alignSelf: 'flex-start',
      }}>
        <Text style={{ fontSize: 20, marginRight: 8 }} importantForAccessibility="no">
          {isNegative ? '⚠️' : '🎉'}
        </Text>
        <AccessibleText variant="caption" bold style={{ color: statusColor }}>
          {statusLabel}
        </AccessibleText>
      </View>

      {/* Card da Consequência */}
      <View style={{
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 22,
        borderWidth: highContrast ? 2 : 1,
        borderColor: highContrast ? statusColor : (isNegative ? colors.dangerBorder : '#22c55e50'),
        marginBottom: 20,
      }}>
        <AccessibleText>{slide.text}</AccessibleText>
      </View>

      {/* Dica de Ouro do Mascote */}
      {slide.tip && (
        <View style={{
          backgroundColor: colors.background,
          borderRadius: 16,
          padding: 16,
          borderLeftWidth: 4,
          borderLeftColor: colors.primary,
          borderWidth: highContrast ? 1 : 0,
          borderColor: colors.border,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ fontSize: 16, marginRight: 6 }} importantForAccessibility="no">💡</Text>
            <AccessibleText variant="caption" bold style={{ color: colors.primaryText }}>
              DICA DO GUARDIÃO
            </AccessibleText>
          </View>
          <AccessibleText variant="caption" muted>
            {slide.tip}
          </AccessibleText>
        </View>
      )}

      <ListenButton text={spokenText} />
    </View>
  );
}
