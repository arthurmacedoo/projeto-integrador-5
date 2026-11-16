// components/accessibility/AccessibleText.tsx
// Substituto do <Text> que já aplica o tamanho de fonte e as cores escolhidas.
import { Text, TextProps } from 'react-native';
import { useAppTheme, BASE_FONT_SIZES } from '@/constants/theme';

interface Props extends TextProps {
  variant?: keyof typeof BASE_FONT_SIZES;
  muted?: boolean;
  bold?: boolean;
}

export default function AccessibleText({ variant = 'body', muted, bold, style, ...rest }: Props) {
  const { colors, fontSize } = useAppTheme();
  const size = fontSize(variant);

  return (
    <Text
      // Também respeita o "tamanho da fonte" do Android, com limite para não quebrar o layout.
      maxFontSizeMultiplier={1.4}
      style={[
        {
          fontSize: size,
          lineHeight: Math.round(size * 1.45),
          color: muted ? colors.textMuted : colors.text,
          fontWeight: bold || variant === 'title' || variant === 'heading' ? 'bold' : 'normal',
        },
        style,
      ]}
      {...rest}
    />
  );
}
