// components/gamification/LevelUpModal.tsx
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import type { LevelUpResult } from '@/types';
import { useAppTheme } from '@/constants/theme';
import { getAvatarEmoji, getAvatarEvolution } from '@/constants/avatars';
import { useUserStore } from '@/store/useUserStore';
import { useAutoRead } from '@/hooks/useSpeech';
import ListenButton from '@/components/accessibility/ListenButton';

interface Props {
  visible: boolean;
  levelUpData: LevelUpResult | null;
  onDismiss: () => void;
}

export default function LevelUpModal({ visible, levelUpData, onDismiss }: Props) {
  const { colors, fs, highContrast } = useAppTheme();
  const avatarId = useUserStore((s) => s.avatarId);

  const spokenText =
    visible && levelUpData
      ? `Evolução de nível! Parabéns, você chegou ao nível ${levelUpData.newLevel}, ${levelUpData.levelName}. Seu avatar e status financeiro acabaram de subir de categoria!`
      : '';

  useAutoRead(spokenText);

  if (!levelUpData) return null;

  const avatarEmoji = getAvatarEmoji(avatarId);
  const prevEvo = getAvatarEvolution(levelUpData.previousLevel);
  const nextEvo = getAvatarEvolution(levelUpData.newAvatarVariant);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      accessibilityViewIsModal
    >
      <View
        style={{
          flex: 1,
          backgroundColor: colors.overlay,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
        }}
      >
        <View
          accessibilityViewIsModal
          style={{
            backgroundColor: colors.surface,
            borderRadius: 28,
            padding: 28,
            alignItems: 'center',
            width: '100%',
            maxWidth: 360,
            borderWidth: 2,
            borderColor: highContrast ? colors.primary : colors.warningBase,
          }}
        >
          <Text style={{ fontSize: fs(48), marginBottom: 8 }} importantForAccessibility="no">
            ⚡🎉
          </Text>

          <Text style={{ color: colors.warning, fontSize: fs(13), fontWeight: 'bold', marginBottom: 4 }}>
            EVOLUÇÃO DE NÍVEL
          </Text>

          <Text
            accessibilityRole="header"
            style={{ color: colors.text, fontSize: fs(26), fontWeight: 'bold', marginBottom: 4, textAlign: 'center' }}
          >
            Nível {levelUpData.newLevel}!
          </Text>

          <Text style={{ color: colors.accentText, fontSize: fs(18), fontWeight: '600', marginBottom: 16, textAlign: 'center' }}>
            {levelUpData.levelName}
          </Text>

          {/* Evolução visual do avatar: Antes → Depois */}
          <View
            accessible
            accessibilityLabel={`Avatar evoluiu do nível ${levelUpData.previousLevel} para o nível ${levelUpData.newLevel}`}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              marginBottom: 16,
            }}
          >
            <View style={{ alignItems: 'center', opacity: 0.75 }}>
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: colors.background,
                  borderWidth: 2,
                  borderColor: highContrast ? colors.border : prevEvo.ringColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 24 }} importantForAccessibility="no">{avatarEmoji}</Text>
                <Text style={{ position: 'absolute', bottom: -6, right: -6, fontSize: 16 }} importantForAccessibility="no">
                  {prevEvo.badge}
                </Text>
              </View>
              <Text style={{ color: colors.textMuted, fontSize: fs(11), marginTop: 6 }}>
                Nível {levelUpData.previousLevel}
              </Text>
            </View>

            <Text style={{ color: colors.warning, fontSize: fs(20), fontWeight: 'bold' }} importantForAccessibility="no">
              ➔
            </Text>

            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: colors.background,
                  borderWidth: 3,
                  borderColor: highContrast ? colors.primary : nextEvo.ringColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 30 }} importantForAccessibility="no">{avatarEmoji}</Text>
                <Text style={{ position: 'absolute', bottom: -6, right: -6, fontSize: 20 }} importantForAccessibility="no">
                  {nextEvo.badge}
                </Text>
              </View>
              <Text style={{ color: colors.warning, fontSize: fs(12), fontWeight: 'bold', marginTop: 6 }}>
                Nível {levelUpData.newLevel}
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: colors.background,
              borderRadius: 16,
              padding: 14,
              width: '100%',
              alignItems: 'center',
              marginBottom: 8,
              borderWidth: highContrast ? 1 : 0,
              borderColor: colors.border,
            }}
          >
            <Text style={{ color: colors.textSoft, fontSize: fs(14), textAlign: 'center' }}>
              Seu avatar e status financeiro acabaram de subir de categoria!
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <ListenButton text={spokenText} />
          </View>

          <TouchableOpacity
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="Continuar jornada"
            style={{
              backgroundColor: colors.warningBase,
              borderRadius: 14,
              minHeight: 48,
              paddingVertical: 14,
              paddingHorizontal: 24,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: colors.background,
                fontWeight: 'bold',
                fontSize: fs(16),
                textAlign: 'center',
              }}
            >
              Continuar Jornada 🚀
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
