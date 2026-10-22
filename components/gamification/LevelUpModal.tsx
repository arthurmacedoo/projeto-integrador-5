// ──────────────────────────────────────────────────────────────
// components/gamification/LevelUpModal.tsx
// Modal de Evolução de Nível (Idêntico à Tela 15 do PDF FinEdu)
// ──────────────────────────────────────────────────────────────
import { Modal, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import type { LevelUpResult } from '@/types';
import { useUserStore } from '@/store/useUserStore';
import { LEVELS } from '@/constants/levels';
import {
  AvatarPortrait,
  IconSparkle,
  IconBackpack,
  IconCheckCircle,
} from '@/components/ui/FinEduIcons';

interface Props {
  visible: boolean;
  levelUpData: LevelUpResult | null;
  onDismiss: () => void;
}

export default function LevelUpModal({ visible, levelUpData, onDismiss }: Props) {
  const { displayName, xp, avatarId } = useUserStore();

  if (!levelUpData) return null;

  const firstName = displayName ? displayName.trim().split(' ')[0] : 'Ana';
  const prevLevelObj = LEVELS.find((l) => l.level === levelUpData.previousLevel);
  const newLevelObj = LEVELS.find((l) => l.level === levelUpData.newLevel);
  const prevLevelName = prevLevelObj?.name ?? 'Iniciante';
  const xpMilestone = newLevelObj?.xpRequired ?? 150;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F6F0' }}>
        <View className="flex-1 px-6 py-8 justify-between items-center">
          <View className="w-full items-center mt-2">
            {/* Badge NOVO NÍVEL */}
            <View
              style={{ backgroundColor: '#D9ECAE' }}
              className="rounded-full px-3.5 py-1 flex-row items-center mb-3"
            >
              <View className="mr-1.5">
                <IconSparkle size={12} color="#1A4731" />
              </View>
              <Text
                style={{ color: '#1A4731' }}
                className="text-[10px] font-extrabold tracking-widest uppercase"
              >
                NOVO NÍVEL
              </Text>
            </View>

            {/* Título e Subtítulo */}
            <Text className="text-ink text-2xl font-extrabold text-center leading-tight mb-1.5">
              Parabéns, {firstName}. Você é {levelUpData.levelName}!
            </Text>
            <Text className="text-ink-muted text-xs text-center leading-relaxed mb-5 px-4">
              Cada escolha te leva mais longe. Seu avatar também está pronto para seguir.
            </Text>

            {/* Card de Evolução do Avatar */}
            <View
              style={{ backgroundColor: '#EFECE4' }}
              className="w-full rounded-3xl p-5 items-center mb-4"
            >
              <View className="flex-row items-end justify-center w-full gap-3 mb-4">
                {/* Avatar Anterior (Menor) */}
                <View className="items-center">
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: '#FFFFFF',
                      borderRadius: 999,
                    }}
                  >
                    <AvatarPortrait id={avatarId ?? 'avatar_1'} size={62} />
                  </View>
                  <Text className="text-ink-muted text-[11px] font-semibold mt-1.5">
                    {levelUpData.previousLevel} · {prevLevelName}
                  </Text>
                </View>

                <Text
                  style={{ color: '#1A4731' }}
                  className="text-base font-bold mb-8"
                >
                  →
                </Text>

                {/* Avatar Novo (Maior + Evoluído com mochila) */}
                <View className="items-center">
                  <View
                    style={{
                      borderWidth: 3,
                      borderColor: '#FFFFFF',
                      borderRadius: 999,
                    }}
                  >
                    <AvatarPortrait
                      id={avatarId ?? 'avatar_1'}
                      size={88}
                      evolved
                    />
                  </View>
                  <View className="bg-white rounded-full px-3 py-0.5 mt-1.5 border border-sand-border">
                    <Text
                      style={{ color: '#1A4731' }}
                      className="text-[11px] font-extrabold"
                    >
                      {levelUpData.newLevel} · {levelUpData.levelName}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="bg-white rounded-full px-4 py-1.5 flex-row items-center border border-sand-border">
                <View className="mr-1.5">
                  <IconBackpack size={13} color="#1A4731" />
                </View>
                <Text className="text-ink text-xs font-bold">
                  Nova mochila, mesma essência.
                </Text>
              </View>
            </View>

            {/* Card Branco de Marco de XP */}
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E3DFD3',
                borderWidth: 1,
              }}
              className="w-full rounded-2xl p-4"
            >
              <View className="flex-row items-center mb-2.5">
                <View className="mr-2">
                  <IconCheckCircle size={15} color="#1A4731" />
                </View>
                <Text className="text-ink text-xs font-extrabold">
                  Nível {levelUpData.newLevel} alcançado aos {xpMilestone} XP
                </Text>
              </View>
              <View className="flex-row items-center justify-between pt-2 border-t border-sand-border">
                <Text className="text-ink-muted text-xs">
                  Seu total acumulado
                </Text>
                <Text className="text-ink text-base font-extrabold">
                  {xp} XP
                </Text>
              </View>
            </View>
          </View>

          {/* CTA Continuar aprendendo */}
          <TouchableOpacity
            onPress={onDismiss}
            activeOpacity={0.85}
            style={{ backgroundColor: '#1A4731' }}
            className="w-full rounded-full py-4 px-6 flex-row items-center justify-center mt-4"
          >
            <Text className="text-white font-bold text-sm mr-2">
              Continuar aprendendo
            </Text>
            <Text className="text-white font-bold text-sm">→</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
