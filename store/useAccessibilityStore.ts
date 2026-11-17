// store/useAccessibilityStore.ts
// Guarda as preferências de acessibilidade do usuário e salva no aparelho
// (continuam valendo mesmo depois de fechar o app e sem internet).
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FontScale = 'normal' | 'grande' | 'extra';
export type SpeechSpeed = 'lenta' | 'normal' | 'rapida';

export const FONT_SCALE_VALUES: Record<FontScale, number> = {
  normal: 1,
  grande: 1.25,
  extra: 1.5,
};

// Diferenças bem perceptíveis (0,75 / 1,25 quase não se distinguiam em várias vozes)
export const SPEECH_RATE_VALUES: Record<SpeechSpeed, number> = {
  lenta: 0.65,
  normal: 1.0,
  rapida: 1.45,
};

interface AccessibilityState {
  fontScale: FontScale;
  highContrast: boolean;
  autoRead: boolean; // lê automaticamente cada slide ao abrir
  speechSpeed: SpeechSpeed;
  voiceId: string | null; // voz escolhida pelo usuário (null = automática, a mais natural)
  setFontScale: (scale: FontScale) => void;
  setHighContrast: (value: boolean) => void;
  setAutoRead: (value: boolean) => void;
  setSpeechSpeed: (speed: SpeechSpeed) => void;
  setVoiceId: (id: string | null) => void;
  reset: () => void;
}

const DEFAULTS = {
  fontScale: 'normal' as FontScale,
  highContrast: false,
  autoRead: false,
  speechSpeed: 'normal' as SpeechSpeed,
  voiceId: null as string | null,
};

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setFontScale: (fontScale) => set({ fontScale }),
      setHighContrast: (highContrast) => set({ highContrast }),
      setAutoRead: (autoRead) => set({ autoRead }),
      setSpeechSpeed: (speechSpeed) => set({ speechSpeed }),
      setVoiceId: (voiceId) => set({ voiceId }),
      reset: () => set(DEFAULTS),
    }),
    {
      name: 'tchoeduca-accessibility',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
