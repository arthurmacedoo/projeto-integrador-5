// ──────────────────────────────────────────────────────────────
// app/onboarding/index.tsx
// Fluxo de Boas-Vindas Inicial (3 passos idênticos ao PDF FinEdu)
// ──────────────────────────────────────────────────────────────
import { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  FinEduBrand,
  AvatarPortrait,
  ShieldHeroIllustration,
  IconSprout,
  IconClock,
  IconSparkle,
} from '@/components/ui/FinEduIcons';

const STEPS = [
  {
    eyebrow: 'APRENDA PARA A VIDA',
    title: 'Seu dinheiro merece boas escolhas.',
    description:
      'No FinEdu, você aprende com histórias do dia a dia. Sem complicar, no seu ritmo.',
    ctaLabel: 'Próximo',
    showSkip: true,
  },
  {
    eyebrow: 'CADA LIÇÃO É UM PASSO',
    title: 'Você aprende. Seu avatar evolui.',
    description:
      'Conclua lições, ganhe XP e alcance novos níveis. Até um erro vira aprendizado: você sempre segue em frente.',
    ctaLabel: 'Próximo',
    showSkip: true,
  },
  {
    eyebrow: 'CONFIANÇA SE APRENDE',
    title: 'Reconheça o golpe antes do Pix.',
    description:
      'Aprenda a identificar ofertas falsas, mensagens suspeitas e pedidos de dinheiro no WhatsApp.',
    badge: 'Histórias rápidas · 3 a 5 minutos',
    ctaLabel: 'Começar',
    showSkip: false,
  },
];

export default function WelcomeOnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      router.push('/(auth)/register');
    }
  }

  function handleSkip() {
    router.push('/(auth)/login');
  }

  function handleLogin() {
    router.push('/(auth)/login');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F6F0' }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-8 pb-8 justify-between">
          {/* Top Header: Brand + Pular */}
          <View className="flex-row items-center justify-between mb-5">
            <FinEduBrand />

            {current.showSkip ? (
              <TouchableOpacity
                onPress={handleSkip}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text className="text-ink-muted text-sm font-semibold">
                  Pular
                </Text>
              </TouchableOpacity>
            ) : (
              <View className="w-10" />
            )}
          </View>

          {/* Ilustração Central do Passo */}
          <View
            style={{ backgroundColor: '#EFECE4', minHeight: 260 }}
            className="rounded-3xl p-6 my-2 justify-center items-center overflow-hidden relative"
          >
            {step === 0 && (
              <View className="w-full items-center">
                {/* Círculo verde-lima de fundo */}
                <View
                  style={{
                    width: 190,
                    height: 190,
                    borderRadius: 95,
                    backgroundColor: '#DCECC1',
                  }}
                  className="items-center justify-center flex-row px-2"
                >
                  {/* Avatar Lia à esquerda */}
                  <View className="-ml-4 mr-2 mt-4">
                    <AvatarPortrait id="avatar_1" size={84} />
                  </View>

                  {/* Card branco levemente inclinado à direita */}
                  <View
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E3DFD3',
                      borderWidth: 1,
                      transform: [{ rotate: '4deg' }],
                      maxWidth: 145,
                    }}
                    className="rounded-2xl p-3.5 shadow-sm"
                  >
                    <Text
                      style={{ color: '#84A96C', fontSize: 12, fontWeight: '700' }}
                      className="mb-1"
                    >
                      💬
                    </Text>
                    <Text className="text-ink text-xs font-extrabold leading-snug">
                      Na vida real, cada escolha conta.
                    </Text>
                  </View>
                </View>

                {/* Pill inferior */}
                <View
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#E3DFD3', borderWidth: 1 }}
                  className="rounded-full px-4 py-1.5 flex-row items-center -mt-3"
                >
                  <View className="mr-1.5">
                    <IconSprout size={13} color="#1A4731" />
                  </View>
                  <Text className="text-ink text-xs font-bold">
                    Uma escolha de cada vez.
                  </Text>
                </View>
              </View>
            )}

            {step === 1 && (
              <View className="w-full items-center">
                <View
                  style={{
                    width: 210,
                    height: 185,
                    borderRadius: 100,
                    backgroundColor: '#DCECC1',
                  }}
                  className="items-center justify-center relative"
                >
                  <View className="flex-row items-end justify-between w-full px-2">
                    {/* Iniciante (Menor, esquerda) */}
                    <View className="items-center">
                      <View
                        style={{ borderWidth: 2, borderColor: '#FFFFFF', borderRadius: 999 }}
                      >
                        <AvatarPortrait id="avatar_1" size={62} />
                      </View>
                      <View className="bg-white rounded-full px-3 py-0.5 mt-1.5 border border-sand-border">
                        <Text className="text-ink text-[11px] font-bold">
                          Iniciante
                        </Text>
                      </View>
                    </View>

                    {/* Seta de evolução */}
                    <Text
                      style={{ color: '#1A4731', fontSize: 18, fontWeight: '700' }}
                      className="mb-10 mx-1"
                    >
                      ⇢
                    </Text>

                    {/* Aprendiz (Maior, direita com mochila) */}
                    <View className="items-center -mt-4">
                      <View
                        style={{ borderWidth: 3, borderColor: '#FFFFFF', borderRadius: 999 }}
                      >
                        <AvatarPortrait id="avatar_1" size={82} evolved />
                      </View>
                      <View className="bg-white rounded-full px-3 py-0.5 mt-1.5 border border-sand-border">
                        <Text className="text-forest text-[11px] font-extrabold">
                          Aprendiz
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Pill + XP */}
                <View
                  style={{ backgroundColor: '#1A4731' }}
                  className="rounded-full px-4 py-1.5 -mt-2 flex-row items-center"
                >
                  <View className="mr-1.5">
                    <IconSparkle size={13} color="#D9ECAE" />
                  </View>
                  <Text className="text-white text-xs font-extrabold">+ XP</Text>
                </View>
              </View>
            )}

            {step === 2 && <ShieldHeroIllustration variant="check" />}
          </View>

          {/* Textos do Passo */}
          <View className="my-3">
            <View
              style={{ backgroundColor: '#E5ECD8' }}
              className="rounded-md px-2.5 py-1 self-start mb-3"
            >
              <Text
                style={{ color: '#1A4731' }}
                className="text-[10px] font-extrabold tracking-widest uppercase"
              >
                {current.eyebrow}
              </Text>
            </View>

            <Text className="text-ink text-3xl font-extrabold leading-tight mb-3">
              {current.title}
            </Text>
            <Text className="text-ink-muted text-sm leading-relaxed">
              {current.description}
            </Text>

            {current.badge && (
              <View
                style={{ backgroundColor: '#EFECE4', borderColor: '#E3DFD3', borderWidth: 1 }}
                className="rounded-full px-3.5 py-2 self-start flex-row items-center mt-4"
              >
                <View className="mr-2">
                  <IconClock size={14} color="#1A4731" />
                </View>
                <Text className="text-ink text-xs font-bold">
                  {current.badge}
                </Text>
              </View>
            )}
          </View>

          {/* Rodapé: Indicador de Progresso + Botão Principal + Link Entrar */}
          <View className="mt-2">
            {/* Dots de Progresso */}
            <View className="flex-row items-center justify-center gap-2 mb-5">
              {STEPS.map((_, idx) => {
                const isActive = idx === step;
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setStep(idx)}
                    style={{
                      width: isActive ? 24 : 7,
                      height: 7,
                      borderRadius: 99,
                      backgroundColor: isActive ? '#1A4731' : '#D6D0C4',
                    }}
                  />
                );
              })}
            </View>

            {/* CTA Primário */}
            <TouchableOpacity
              onPress={handleNext}
              activeOpacity={0.85}
              style={{ backgroundColor: '#1A4731' }}
              className="w-full rounded-full py-4 px-6 flex-row items-center justify-center"
            >
              <Text className="text-white font-bold text-sm mr-2">
                {current.ctaLabel}
              </Text>
              <Text className="text-white font-bold text-sm">→</Text>
            </TouchableOpacity>

            {/* Link Já tenho conta · Entrar */}
            <TouchableOpacity
              onPress={handleLogin}
              className="mt-4 py-2 items-center justify-center flex-row"
            >
              <Text className="text-ink-muted text-xs">Já tenho conta · </Text>
              <Text style={{ color: '#1A4731' }} className="text-xs font-bold">
                Entrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
