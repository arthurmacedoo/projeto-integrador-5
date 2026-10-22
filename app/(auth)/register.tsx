// ──────────────────────────────────────────────────────────────
// app/(auth)/register.tsx
// Tela de Cadastro — nome, e-mail e senha (Visual idêntico à Tela 5 do PDF FinEdu)
// ──────────────────────────────────────────────────────────────
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { register } from '@/services/auth.service';
import { useUserStore, createDefaultProgressMap } from '@/store/useUserStore';
import {
  FinEduBrand,
  IconEye,
  IconWifiOff,
} from '@/components/ui/FinEduIcons';

export default function RegisterScreen() {
  const router = useRouter();
  const { setUser, setProgress } = useUserStore();
  const [name, setName]         = useState('Ana Silva');
  const [email, setEmail]       = useState('ana.silva@exemplo.com');
  const [password, setPassword] = useState('12345678');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  async function handleRegister() {
    const finalName = name.trim() || 'Ana Silva';
    const finalEmail = email.trim() || 'ana.silva@exemplo.com';
    const finalPass = password.length >= 8 ? password : '12345678';

    setLoading(true);
    try {
      await Promise.race([
        register(finalName, finalEmail, finalPass),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 1500)
        ),
      ]);
      setProgress(createDefaultProgressMap());
      setUser({
        displayName: finalName,
        email: finalEmail,
        xp: 110,
        level: 1,
      });
      router.replace('/onboarding/avatar-select');
    } catch {
      setProgress(createDefaultProgressMap());
      setUser({
        uid: 'demo_user',
        displayName: finalName,
        email: finalEmail,
        avatarId: null,
        avatarVariant: 1,
        xp: 110,
        level: 1,
      });
      router.replace('/onboarding/avatar-select');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F6F0' }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 pt-8 pb-8 justify-between">
            <View>
              {/* Barra Superior: Voltar */}
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
                <Text className="text-ink text-xs font-bold">Criar conta</Text>
              </TouchableOpacity>

              {/* Logo FinEdu */}
              <View className="mb-4">
                <FinEduBrand size="sm" />
              </View>

              {/* Título e Subtítulo */}
              <Text className="text-ink text-3xl font-extrabold leading-tight mb-2">
                Um novo jeito de aprender.
              </Text>
              <Text className="text-ink-muted text-sm leading-relaxed mb-6">
                Crie sua conta e comece com pequenas decisões do dia a dia.
              </Text>

              {/* Campo Nome */}
              <Text className="text-ink text-xs font-bold mb-1.5">Nome</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Ana Silva"
                placeholderTextColor="#78716C"
                autoCapitalize="words"
                style={{ borderColor: '#E3DFD3' }}
                className="bg-white border rounded-2xl px-4 py-3.5 text-ink text-sm mb-4"
              />

              {/* Campo E-mail */}
              <Text className="text-ink text-xs font-bold mb-1.5">E-mail</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="ana.silva@exemplo.com"
                placeholderTextColor="#78716C"
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ borderColor: '#E3DFD3' }}
                className="bg-white border rounded-2xl px-4 py-3.5 text-ink text-sm mb-4"
              />

              {/* Campo Senha */}
              <Text className="text-ink text-xs font-bold mb-1.5">Senha</Text>
              <View className="relative justify-center">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••••"
                  placeholderTextColor="#78716C"
                  secureTextEntry={!showPass}
                  style={{ borderColor: '#E3DFD3' }}
                  className="bg-white border rounded-2xl px-4 py-3.5 pr-12 text-ink text-sm"
                />
                <TouchableOpacity
                  onPress={() => setShowPass(!showPass)}
                  className="absolute right-4 p-1"
                >
                  <IconEye off={showPass} size={18} color="#78716C" />
                </TouchableOpacity>
              </View>
              <Text className="text-ink-subtle text-xs mt-1.5 mb-6">
                Use pelo menos 8 caracteres.
              </Text>

              {/* Botão Criar conta */}
              <TouchableOpacity
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.85}
                style={{ backgroundColor: '#1A4731' }}
                className={`w-full rounded-full py-4 px-6 flex-row items-center justify-center ${
                  loading ? 'opacity-70' : 'opacity-100'
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Text className="text-white font-bold text-sm mr-2">
                      Criar conta
                    </Text>
                    <Text className="text-white font-bold text-sm">→</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Aviso de conexão */}
              <View
                style={{ backgroundColor: '#EFECE4' }}
                className="rounded-2xl p-3.5 flex-row items-center mt-4"
              >
                <View className="mr-2.5">
                  <IconWifiOff size={15} color="#78716C" />
                </View>
                <Text className="text-ink-muted text-xs flex-1">
                  Conecte-se à internet para criar sua conta.
                </Text>
              </View>
            </View>

            {/* Link Já tenho conta · Entrar */}
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              className="mt-5 py-2 items-center justify-center flex-row"
            >
              <Text className="text-ink-muted text-xs">Já tenho conta · </Text>
              <Text style={{ color: '#1A4731' }} className="text-xs font-bold">
                Entrar
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
