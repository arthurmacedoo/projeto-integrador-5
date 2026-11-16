// components/slides/DecisionSlide.tsx
import { View, TouchableOpacity } from 'react-native';
import type { DecisionSlide as DecisionSlideType, DecisionOption } from '@/types';
import { useAppTheme } from '@/constants/theme';
import { useAutoRead } from '@/hooks/useSpeech';
import AccessibleText from '@/components/accessibility/AccessibleText';
import ListenButton from '@/components/accessibility/ListenButton';

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
  const { colors, highContrast } = useAppTheme();
  const spokenText =
    `${slide.question} ` +
    slide.options.map((o) => `Opção ${o.id}: ${o.text.replace(/[.!?…\s]+$/, '')}.`).join(' ');

  useAutoRead(spokenText);

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      {/* Título de Decisão */}
      <View style={{
        backgroundColor: colors.primarySoft,
        borderWidth: highContrast ? 1 : 0,
        borderColor: colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 12,
      }}>
        <AccessibleText variant="caption" bold style={{ color: colors.primaryText }}>
          SUA VEZ DE DECIDIR 💡
        </AccessibleText>
      </View>

      <AccessibleText variant="title" accessibilityRole="header" style={{ marginBottom: 8 }}>
        {slide.question}
      </AccessibleText>

      <View style={{ marginBottom: 16 }}>
        <ListenButton text={spokenText} />
      </View>

      {/* Opções de Escolha */}
      <View style={{ gap: 12 }} accessibilityRole="radiogroup">
        {slide.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              onPress={() => onSelectOption(opt)}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected, selected: isSelected }}
              aria-checked={isSelected} // web (navegador) usa o atributo ARIA padrão
              accessibilityLabel={`Opção ${opt.id}: ${opt.text}`}
              style={{
                backgroundColor: isSelected
                  ? (highContrast ? colors.primary : colors.surfaceSelected)
                  : colors.surface,
                minHeight: 56,
                padding: 18,
                borderRadius: 16,
                borderWidth: isSelected ? 3 : 2,
                borderColor: isSelected ? colors.primary : colors.border,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: isSelected ? colors.primary : colors.background,
                borderWidth: highContrast ? 1 : 0,
                borderColor: isSelected ? colors.onPrimary : colors.border,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 14,
              }}>
                <AccessibleText
                  variant="caption"
                  bold
                  style={{ color: isSelected ? colors.onPrimary : colors.textMuted }}
                >
                  {opt.id}
                </AccessibleText>
              </View>
              <AccessibleText
                bold={isSelected}
                style={{
                  flex: 1,
                  color: isSelected && highContrast ? colors.onPrimary : colors.text,
                }}
              >
                {opt.text}
              </AccessibleText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
