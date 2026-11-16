// components/gamification/LevelUpModal.tsx
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import type { LevelUpResult } from '@/types';
import { useAppTheme } from '@/constants/theme';

interface Props {
  visible: boolean;
  levelUpData: LevelUpResult | null;
  onDismiss: () => void;
}

export default function LevelUpModal({ visible, levelUpData, onDismiss }: Props) {
  const { colors, fs, highContrast } = useAppTheme();
  if (!levelUpData) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}>
        <View style={{
          backgroundColor: colors.surface,
          ...(highContrast && { borderWidth: 1, borderColor: colors.border }),
          borderRadius: 28,
          padding: 28,
          alignItems: 'center',
          width: '100%',
          maxWidth: 360,
          borderWidth: 2,
          borderColor: colors.warningBase,
        }}>
          <Text style={{ fontSize: fs(56), marginBottom: 8 }}>⚡🎉</Text>

          <Text style={{ color: colors.warningBase, fontSize: fs(13), fontWeight: 'bold', marginBottom: 4 }}>
            EVOLUÇÃO DE NÍVEL
          </Text>

          <Text style={{ color: colors.text, fontSize: fs(26), fontWeight: 'bold', marginBottom: 8 }}>
            Nível {levelUpData.newLevel}!
          </Text>

          <Text style={{ color: colors.accentText, fontSize: fs(18), fontWeight: '600', marginBottom: 20 }}>
            {levelUpData.levelName}
          </Text>

          <View style={{
            backgroundColor: colors.background,
            borderRadius: 16,
            padding: 16,
            width: '100%',
            alignItems: 'center',
            marginBottom: 24,
          }}>
            <Text style={{ color: colors.textSoft, fontSize: fs(14), textAlign: 'center' }}>
              Seu avatar e status financeiro acabaram de subir de categoria!
            </Text>
          </View>

          <TouchableOpacity
            onPress={onDismiss}
            style={{
              backgroundColor: colors.warningBase,
              borderRadius: 14,
              paddingVertical: 14,
              paddingHorizontal: 32,
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: colors.background, fontWeight: 'bold', fontSize: fs(16) }}>
              Continuar Jornada 🚀
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
