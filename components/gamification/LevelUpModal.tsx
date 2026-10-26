// components/gamification/LevelUpModal.tsx
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import type { LevelUpResult } from '@/types';

interface Props {
  visible: boolean;
  levelUpData: LevelUpResult | null;
  onDismiss: () => void;
}

export default function LevelUpModal({ visible, levelUpData, onDismiss }: Props) {
  if (!levelUpData) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}>
        <View style={{
          backgroundColor: '#1e293b',
          borderRadius: 28,
          padding: 28,
          alignItems: 'center',
          width: '100%',
          maxWidth: 360,
          borderWidth: 2,
          borderColor: '#f59e0b',
        }}>
          <Text style={{ fontSize: 56, marginBottom: 8 }}>⚡🎉</Text>

          <Text style={{ color: '#f59e0b', fontSize: 13, fontWeight: 'bold', marginBottom: 4 }}>
            EVOLUÇÃO DE NÍVEL
          </Text>

          <Text style={{ color: '#f8fafc', fontSize: 26, fontWeight: 'bold', marginBottom: 8 }}>
            Nível {levelUpData.newLevel}!
          </Text>

          <Text style={{ color: '#38bdf8', fontSize: 18, fontWeight: '600', marginBottom: 20 }}>
            {levelUpData.levelName}
          </Text>

          <View style={{
            backgroundColor: '#0f172a',
            borderRadius: 16,
            padding: 16,
            width: '100%',
            alignItems: 'center',
            marginBottom: 24,
          }}>
            <Text style={{ color: '#cbd5e1', fontSize: 14, textAlign: 'center' }}>
              Seu avatar e status financeiro acabaram de subir de categoria!
            </Text>
          </View>

          <TouchableOpacity
            onPress={onDismiss}
            style={{
              backgroundColor: '#f59e0b',
              borderRadius: 14,
              paddingVertical: 14,
              paddingHorizontal: 32,
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#0f172a', fontWeight: 'bold', fontSize: 16 }}>
              Continuar Jornada 🚀
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
