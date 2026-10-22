// ──────────────────────────────────────────────────────────────
// app/onboarding/avatar-select.tsx
// Seleção de avatar pós-cadastro (Grid 3x2 idêntico à Tela 6 do PDF FinEdu)
// ──────────────────────────────────────────────────────────────
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { updateAvatar as updateAvatarService } from '@/services/auth.service';
import { useUserStore } from '@/store/useUserStore';
import {
  AvatarPortrait,
  IconCheck,
  IconCheckCircle,
} from '@/components/ui/FinEduIcons';

export const AVATARS = [
  {
    id: 'avatar_1',
    label: 'Lia',
    selectedText: 'Lia selecionada.',
    readyText: 'Pronta para aprender com você!',
  },
  {
    id: 'avatar_2',
    label: 'Caio',
    selectedText: 'Caio selecionado.',
    readyText: 'Pronto para aprender com você!',
  },
  {
    id: 'avatar_3',
    label: 'Bia',
    selectedText: 'Bia selecionada.',
    readyText: 'Pronta para aprender com você!',
  },
  {
    id: 'avatar_4',
    label: 'Ravi',
    selectedText: 'Ravi selecionado.',
    readyText: 'Pronto para aprender com você!',
  },
  {
    id: 'avatar_5',
    label: 'Iara',
    selectedText: 'Iara selecionada.',
    readyText: 'Pronta para aprender com você!',
  },
  {
    id: 'avatar_6',
    label: 'Alex',
    selectedText: 'Alex selecionado.',
    readyText: 'Pronto para aprender com você!',
  },
];

export default function AvatarSelectScreen() {
  const router = useRouter();
  const { uid, displayName, email, xp, level, setUser, updateAvatar } = useUserStore();
  const [selected, setSelected] = useState<string>('avatar_1');
  const [loading, setLoading] = useState(false);

  const selectedAvatar = AVATARS.find((a) => a.id === selected) ?? AVATARS[0];

  async function handleConfirm() {
    if (!selected) return;
    setLoading(true);
    try {
      if (uid && uid !== 'demo_user') {
        await Promise.race([
          updateAvatarService(uid, selected),
          new Promise((resolve) => setTimeout(resolve, 1000)),
        ]);
      }
    } catch {
      // Continua em modo demo
    } finally {
      setUser({
        uid: uid ?? 'demo_user',
        displayName: displayName ?? 'Ana Silva',
        email: email ?? 'ana.silva@exemplo.com',
        avatarId: selected,
        xp: xp || 110,
        level: level || 1,
      });
      updateAvatar(selected);
      setLoading(false);
      router.replace('/(app)');
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F6F0' }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-8 pb-8 justify-between">
          <View>
            {/* Header superior */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-row items-center self-start mb-5"
            >
              <View
                style={{ backgroundColor: '#EFECE4' }}
                className="w-8 h-8 rounded-full items-center justify-center mr-2.5"
              >
                <Text className="text-ink text-sm font-bold">←</Text>
              </View>
              <Text className="text-ink text-xs font-bold">
                Seu primeiro passo
              </Text>
            </TouchableOpacity>

            {/* Badge Nível 1 */}
            <View
              style={{ backgroundColor: '#E5ECD8' }}
              className="rounded-md px-2.5 py-1 self-start mb-3"
            >
              <Text
                style={{ color: '#1A4731' }}
                className="text-[10px] font-extrabold tracking-widest uppercase"
              >
                NÍVEL 1 · INICIANTE
              </Text>
            </View>

            {/* Título e Subtítulo */}
            <Text className="text-ink text-3xl font-extrabold leading-tight mb-2">
              Quem vai com você nessa jornada?
            </Text>
            <Text className="text-ink-muted text-sm leading-relaxed mb-6">
              Escolha seu avatar. Ele começa com um visual simples e evolui com você.
            </Text>

            {/* Grid 3x2 de Avatares Ilustrados */}
            <View className="flex-row flex-wrap justify-between gap-y-3">
              {AVATARS.map((item) => {
                const isSelected = selected === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => setSelected(item.id)}
                    activeOpacity={0.85}
                    style={{
                      width: '31%',
                      backgroundColor: isSelected ? '#F2F7E9' : '#FFFFFF',
                      borderColor: isSelected ? '#1A4731' : '#E3DFD3',
                      borderWidth: isSelected ? 2 : 1,
                    }}
                    className="rounded-2xl py-4 px-2 items-center justify-center"
                  >
                    <View className="mb-2.5">
                      <AvatarPortrait id={item.id} size={64} />
                    </View>
                    <View className="flex-row items-center">
                      <Text
                        style={{ color: isSelected ? '#1A4731' : '#1C1917' }}
                        className="text-xs font-bold mr-1"
                      >
                        {item.label}
                      </Text>
                      {isSelected && <IconCheckCircle size={13} color="#1A4731" />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Rodapé: Card de confirmação + Botão Confirmar avatar */}
          <View className="mt-6">
            {/* Card de confirmação inferior */}
            <View
              style={{ backgroundColor: '#E5ECD8', borderColor: '#C8DDB0', borderWidth: 1 }}
              className="rounded-2xl p-3.5 flex-row items-center mb-5"
            >
              <View className="mr-3">
                <IconCheck size={16} color="#1A4731" />
              </View>
              <View className="flex-1">
                <Text className="text-ink text-xs leading-snug font-semibold">
                  {selectedAvatar.selectedText} {selectedAvatar.readyText}
                </Text>
              </View>
            </View>

            {/* Botão Confirmar */}
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={!selected || loading}
              activeOpacity={0.85}
              style={{ backgroundColor: '#1A4731' }}
              className={`w-full rounded-full py-4 px-6 flex-row items-center justify-center ${
                !selected || loading ? 'opacity-60' : 'opacity-100'
              }`}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Text className="text-white font-bold text-sm mr-2">
                    Confirmar avatar
                  </Text>
                  <Text className="text-white font-bold text-sm">→</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
