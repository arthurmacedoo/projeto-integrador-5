// app/(app)/accessibility.tsx
// Tela "Acessibilidade" — aberta pelo botão na tela de Perfil.
// Fica fora da bottom-bar (href: null em app/(app)/_layout.tsx).
import { useEffect } from 'react';
import { Platform, Pressable, ScrollView, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import AccessibleText from '@/components/accessibility/AccessibleText';
import ListenButton from '@/components/accessibility/ListenButton';
import { useAppTheme } from '@/constants/theme';
import { usePortugueseVoices, speakSample, stopSpeech } from '@/hooks/useSpeech';
import {
  useAccessibilityStore,
  FontScale,
  SpeechSpeed,
  SPEECH_RATE_VALUES,
} from '@/store/useAccessibilityStore';

const FONT_OPTIONS: { value: FontScale; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'grande', label: 'Grande' },
  { value: 'extra', label: 'Extra grande' },
];

const SPEED_OPTIONS: { value: SpeechSpeed; label: string }[] = [
  { value: 'lenta', label: 'Lenta' },
  { value: 'normal', label: 'Normal' },
  { value: 'rapida', label: 'Rápida' },
];

function OptionGroup<T extends string>({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: { value: T; label: string }[];
  selected: T;
  onSelect: (v: T) => void;
}) {
  const { colors } = useAppTheme();
  return (
    <View style={{ gap: 12 }}>
      <AccessibleText variant="title" accessibilityRole="header" aria-level={2}>
        {title}
      </AccessibleText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }} accessibilityRole="radiogroup">
        {options.map((opt) => {
          const isSelected = opt.value === selected;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onSelect(opt.value)}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected, selected: isSelected }}
              aria-checked={isSelected} // web (navegador) usa o atributo ARIA padrão
              accessibilityLabel={`${title}: ${opt.label}`}
              style={{
                minHeight: 48,
                paddingHorizontal: 16,
                justifyContent: 'center',
                borderRadius: 12,
                borderWidth: 2,
                borderColor: isSelected ? colors.primary : colors.border,
                backgroundColor: isSelected ? colors.primary : 'transparent',
              }}
            >
              <AccessibleText bold style={{ color: isSelected ? colors.onPrimary : colors.text }}>
                {opt.label}
              </AccessibleText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function SwitchRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const { colors } = useAppTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48 }}>
      <View style={{ flex: 1, gap: 4 }}>
        <AccessibleText bold>{label}</AccessibleText>
        <AccessibleText variant="caption" muted>
          {description}
        </AccessibleText>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        accessibilityLabel={label}
        accessibilityHint={description}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={value ? colors.onPrimary : '#cbd5e1'}
        {...(Platform.OS === 'web'
          ? ({ activeThumbColor: colors.onPrimary } as Record<string, unknown>)
          : {})}
      />
    </View>
  );
}

export default function AccessibilityScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { status: voiceStatus, voices } = usePortugueseVoices();
  const {
    fontScale,
    highContrast,
    autoRead,
    speechSpeed,
    voiceId,
    setFontScale,
    setHighContrast,
    setAutoRead,
    setSpeechSpeed,
    setVoiceId,
    reset,
  } = useAccessibilityStore();

  // Para qualquer amostra de voz (velocidade/voz) ao sair da tela de Acessibilidade
  useEffect(() => () => stopSpeech(), []);

  // Ao escolher velocidade ou voz, já fala uma frase de exemplo — o usuário ouve a diferença na hora.
  const SPEED_SAMPLE: Record<SpeechSpeed, string> = {
    lenta: 'Esta é a velocidade lenta.',
    normal: 'Esta é a velocidade normal.',
    rapida: 'Esta é a velocidade rápida.',
  };
  function chooseSpeed(speed: SpeechSpeed) {
    setSpeechSpeed(speed);
    speakSample(SPEED_SAMPLE[speed], SPEECH_RATE_VALUES[speed], voiceId);
  }
  function chooseVoice(id: string) {
    const newId = id === 'auto' ? null : id;
    setVoiceId(newId);
    const name = id === 'auto' ? 'automática' : voices.find((v) => v.id === id)?.label ?? '';
    speakSample(`Olá! Esta é a voz ${name}.`, SPEECH_RATE_VALUES[speechSpeed], newId);
  }
  const voiceOptions = [
    { value: 'auto', label: '✨ Automática (mais natural)' },
    ...voices.slice(0, 8).map((v) => ({
      value: v.id,
      label: `${v.label}${v.natural ? ' ✨' : ''}${v.gender ? ` · ${v.gender}` : ''}`,
    })),
  ];
  const selectedVoice = voiceId && voices.some((v) => v.id === voiceId) ? voiceId : 'auto';

  const previewText =
    'João recebeu uma mensagem pedindo para estornar um Pix. O que ele deve fazer?';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 24, paddingTop: 56, gap: 28 }}
    >
      <Pressable
        onPress={() => router.push('/(app)/profile')}
        accessibilityRole="button"
        accessibilityLabel="Voltar para Perfil"
        hitSlop={12}
        style={{ minHeight: 48, justifyContent: 'center', alignSelf: 'flex-start' }}
      >
        <AccessibleText bold style={{ color: colors.primaryText }}>← Voltar</AccessibleText>
      </Pressable>

      <AccessibleText variant="heading" accessibilityRole="header">
        Acessibilidade
      </AccessibleText>

      <OptionGroup
        title="Tamanho do texto"
        options={FONT_OPTIONS}
        selected={fontScale}
        onSelect={setFontScale}
      />

      <SwitchRow
        label="Alto contraste"
        description="Fundo preto e letras brancas, mais fácil de ler no sol ou com pouca visão."
        value={highContrast}
        onChange={setHighContrast}
      />

      <SwitchRow
        label="Ler lições automaticamente"
        description="O app lê cada cena em voz alta assim que ela aparece."
        value={autoRead}
        onChange={setAutoRead}
      />

      <OptionGroup
        title="Velocidade da voz"
        options={SPEED_OPTIONS}
        selected={speechSpeed}
        onSelect={chooseSpeed}
      />

      {/* Escolha da voz (só aparece se o aparelho tiver mais de uma voz em português) */}
      {voices.length > 1 && (
        <View style={{ gap: 8 }}>
          <OptionGroup
            title="Voz"
            options={voiceOptions}
            selected={selectedVoice}
            onSelect={chooseVoice}
          />
          <AccessibleText variant="caption" muted>
            Nomes inspirados na cultura cuiabana. ✨ = voz natural (neural), mais suave. Toque para ouvir cada uma.
          </AccessibleText>
        </View>
      )}

      {/* Aviso: aparelho/navegador sem voz em português */}
      {voiceStatus === 'missing' && (
        <View
          accessibilityRole="alert"
          style={{
            padding: 16,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.warningBase,
            backgroundColor: colors.warningSoft,
            gap: 6,
          }}
        >
          <AccessibleText bold style={{ color: colors.warning }}>
            ⚠️ Nenhuma voz em português encontrada
          </AccessibleText>
          <AccessibleText variant="caption">
            {Platform.select({
              android:
                'Instale em Configurações → Acessibilidade → Saída de texto para voz → baixe "Português (Brasil)".',
              ios: 'Instale em Ajustes → Acessibilidade → Conteúdo Falado → Vozes → Português (Brasil).',
              default:
                'Use o Chrome, Edge ou Safari atualizado, ou instale a voz "Português (Brasil)" nas configurações de fala do computador.',
            })}
          </AccessibleText>
        </View>
      )}

      {/* Prévia: o usuário vê e ouve como vai ficar */}
      <View
        style={{
          padding: 20,
          borderRadius: 16,
          borderWidth: 2,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          gap: 12,
        }}
      >
        <AccessibleText variant="caption" muted>
          Prévia
        </AccessibleText>
        <AccessibleText>{previewText}</AccessibleText>
        <ListenButton text={previewText} />
      </View>

      <Pressable
        onPress={reset}
        accessibilityRole="button"
        accessibilityLabel="Restaurar configurações padrão de acessibilidade"
        style={{ minHeight: 48, justifyContent: 'center', alignItems: 'center' }}
      >
        <AccessibleText bold style={{ color: colors.primaryText, textDecorationLine: 'underline' }}>
          Restaurar padrão
        </AccessibleText>
      </Pressable>
    </ScrollView>
  );
}
