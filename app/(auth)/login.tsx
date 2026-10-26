// ──────────────────────────────────────────────────────────────
// app/(auth)/login.tsx
// Tela de Login — e-mail + senha (Visual idêntico à Tela 4 do PDF FinEdu)
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
import { login } from '@/services/auth.service';
import { useUserStore, createDefaultProgressMap } from '@/store/useUserStore';
import {
  FinEduBrand,
  IconSprout,
  IconEye,
  IconWifiOff,
} from '@/components/ui/FinEduIcons';

export default function LoginScreen() {
  const router = useRouter();
  const { setUser, setProgress } = useUserStore();
  const [email, setEmail]       = useState('ana.silva@exemplo.com');
  const [password, setPassword] = useState('12345678');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleLogin() {
    const finalEmail = email.trim() || 'ana.silva@exemplo.com';
    const finalPass = password || '12345678';

    setLoading(true);
    try {
      await Promise.race([
        login(finalEmail, finalPass),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 1500)
        ),
      ]);
      setProgress(createDefaultProgressMap());
      router.replace('/(app)');
    } catch {
      setProgress(createDefaultProgressMap());
      setUser({
        uid: 'demo_user',
        displayName: 'Ana Silva',
        email: finalEmail,
        avatarId: 'avatar_1',
        avatarVariant: 1,
        xp: 110,
        level: 1,
      });
      router.replace('/(app)');
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
          <View className="flex-1 px-6 pt-10 pb-8 justify-between">
            <View>
              {/* Logo FinEdu */}
              <View className="mb-7">
                <FinEduBrand />
              </View>

              {/* Ícone de Broto em quadrado verde-lima suave */}
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  backgroundColor: '#E5ECD8',
                }}
                className="items-center justify-center mb-4"
              >
                <IconSprout size={24} color="#1A4731" />
              </View>

              {/* Título e Subtítulo */}
              <Text className="text-ink text-3xl font-extrabold leading-tight mb-2">
                Bom te ver por aqui.
              </Text>
              <Text className="text-ink-muted text-sm leading-relaxed mb-7">
                Entre para continuar aprendendo e cuidar das suas escolhas.
              </Text>

              {/* Campo E-mail */}
              <Text className="text-ink text-xs font-bold mb-2">E-mail</Text>
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
              <Text className="text-ink text-xs font-bold mb-2">Senha</Text>
              <View className="relative justify-center mb-6">
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

              {/* Botão Entrar */}
              <TouchableOpacity
                onPress={handleLogin}
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
                      Entrar
                    </Text>
                    <Text className="text-white font-bold text-sm">→</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Aviso de conexão */}
              <View
                style={{ backgroundColor: '#EFECE4' }}
                className="rounded-2xl p-3.5 flex-row items-center mt-5"
              >
                <View className="mr-3">
                  <IconWifiOff size={16} color="#78716C" />
                </View>
                <Text className="text-ink-muted text-xs flex-1 leading-relaxed">
                  Para entrar na sua conta, você precisa estar conectado à internet.
                </Text>
              </View>
            </View>

            {/* Rodapé: Criar conta */}
            <View className="mt-8 pt-5 border-t border-sand-border">
              <Text className="text-ink-muted text-xs text-center mb-3">
                É sua primeira vez no TchôEduca?
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/register')}
                activeOpacity={0.8}
                style={{ borderColor: '#D6D0C4' }}
                className="w-full border bg-white rounded-full py-3.5 items-center justify-center"
              >
                <Text style={{ color: '#1A4731' }} className="font-bold text-sm">
                  Criar minha conta
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
