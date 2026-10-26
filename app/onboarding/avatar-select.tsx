// ──────────────────────────────────────────────────────────────
// app/onboarding/avatar-select.tsx
// Seleção de avatar pós-cadastro
// ──────────────────────────────────────────────────────────────
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { updateAvatar as updateAvatarService } from '@/services/auth.service';
import { useUserStore } from '@/store/useUserStore';

const AVATARS = [
  { id: 'avatar_1', emoji: '🧑', label: 'Lucas'  },
  { id: 'avatar_2', emoji: '👩', label: 'Ana'    },
  { id: 'avatar_3', emoji: '🧔', label: 'Carlos' },
  { id: 'avatar_4', emoji: '👩‍🦱', label: 'Maria'  },
  { id: 'avatar_5', emoji: '🧑‍🎓', label: 'Pedro'  },
  { id: 'avatar_6', emoji: '👩‍💼', label: 'Júlia'  },
];

export default function AvatarSelectScreen() {
  const { uid, updateAvatar } = useUserStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (!selected || !uid) return;
    try {
      setLoading(true);
      await updateAvatarService(uid, selected);
      updateAvatar(selected); // atualiza store → _layout.tsx redireciona para Home
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o avatar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0f172a', padding: 24, paddingTop: 56 }}>
      <Text style={{ color: '#f1f5f9', fontSize: 26, fontWeight: 'bold', marginBottom: 8 }}>
        Escolha seu avatar 🎭
      </Text>
      <Text style={{ color: '#94a3b8', fontSize: 14, marginBottom: 32 }}>
        Ele vai evoluir conforme você aprende!
      </Text>

      <FlatList
        data={AVATARS}
        numColumns={3}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12 }}
        columnWrapperStyle={{ gap: 12 }}
        renderItem={({ item }) => {
          const isSelected = selected === item.id;
          return (
            <TouchableOpacity
              onPress={() => setSelected(item.id)}
              style={{
                flex: 1,
                aspectRatio: 1,
                backgroundColor: isSelected ? '#1e3a5f' : '#1e293b',
                borderRadius: 16,
                borderWidth: 2,
                borderColor: isSelected ? '#3b82f6' : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 40, marginBottom: 6 }}>{item.emoji}</Text>
              <Text style={{ color: isSelected ? '#3b82f6' : '#94a3b8', fontSize: 13 }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity
        onPress={handleConfirm}
        disabled={!selected || loading}
        style={{
          backgroundColor: selected ? '#3b82f6' : '#1e293b',
          borderRadius: 14,
          padding: 16,
          alignItems: 'center',
          marginTop: 28,
          opacity: !selected || loading ? 0.5 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
            {selected ? 'Confirmar escolha' : 'Selecione um avatar'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
