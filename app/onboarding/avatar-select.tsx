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
} from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { updateAvatar as updateAvatarService } from '@/services/auth.service';
import { useUserStore } from '@/store/useUserStore';
import { useAppTheme } from '@/constants/theme';
import { AVATARS } from '@/constants/avatars';
import { showAlert } from '@/utils/alert';

export default function AvatarSelectScreen() {
  const { colors, fs, highContrast } = useAppTheme();
  const { uid, updateAvatar } = useUserStore(
    useShallow((s) => ({ uid: s.uid, updateAvatar: s.updateAvatar }))
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (!selected || !uid) return;
    try {
      setLoading(true);
      await updateAvatarService(uid, selected);
      updateAvatar(selected); // atualiza store → _layout.tsx redireciona para Home
    } catch {
      showAlert('Erro', 'Não foi possível salvar o avatar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 24, paddingTop: 56 }}>
      <Text
        accessibilityRole="header"
        style={{ color: colors.textStrong, fontSize: fs(26), fontWeight: 'bold', marginBottom: 8 }}
      >
        Escolha seu avatar 🎭
      </Text>
      <Text style={{ color: colors.textMuted, fontSize: fs(14), marginBottom: 32 }}>
        Ele vai evoluir conforme você aprende!
      </Text>

      <FlatList
        data={AVATARS}
        numColumns={3}
        accessibilityRole="radiogroup"
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12 }}
        columnWrapperStyle={{ gap: 12 }}
        renderItem={({ item }) => {
          const isSelected = selected === item.id;
          return (
            <TouchableOpacity
              onPress={() => setSelected(item.id)}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected, selected: isSelected }}
              aria-checked={isSelected}
              accessibilityLabel={`Avatar ${item.label}`}
              style={{
                flex: 1,
                aspectRatio: 1,
                backgroundColor: isSelected ? colors.surfaceSelected : colors.surface,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: isSelected ? colors.primary : (highContrast ? colors.border : 'transparent'),
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: fs(40), marginBottom: 6 }} importantForAccessibility="no">{item.emoji}</Text>
              <Text style={{ color: isSelected ? colors.primaryText : colors.textMuted, fontSize: fs(13), fontWeight: isSelected ? 'bold' : 'normal' }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity
        onPress={handleConfirm}
        disabled={!selected || loading}
        accessibilityRole="button"
        accessibilityLabel={selected ? 'Confirmar escolha de avatar' : 'Selecione um avatar'}
        accessibilityState={{ disabled: !selected || loading }}
        aria-disabled={!selected || loading}
        style={{
          backgroundColor: selected ? colors.primary : colors.surface,
          borderRadius: 14,
          borderWidth: !selected && highContrast ? 2 : 0,
          borderColor: colors.border,
          padding: 16,
          minHeight: 52,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 28,
          opacity: !selected || loading ? (highContrast ? 0.85 : 0.65) : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color={colors.onPrimary} />
        ) : (
          <Text style={{ color: selected ? colors.onPrimary : colors.textMuted, fontWeight: 'bold', fontSize: fs(16) }}>
            {selected ? 'Confirmar escolha' : 'Selecione um avatar'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
