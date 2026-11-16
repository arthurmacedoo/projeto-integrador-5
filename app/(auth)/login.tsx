// ──────────────────────────────────────────────────────────────
// app/(auth)/login.tsx
// Tela de Login — e-mail + senha via Firebase Auth
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
} from 'react-native';
import { Link } from 'expo-router';
import { login } from '@/services/auth.service';
import { useAppTheme } from '@/constants/theme';
import { showAlert } from '@/utils/alert';

export default function LoginScreen() {
  const { colors, fs, highContrast } = useAppTheme();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      showAlert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
    try {
      setLoading(true);
      await login(email.trim(), password);
      // O observer em _layout.tsx redireciona automaticamente
    } catch (err: any) {
      const msg =
        err.code === 'auth/invalid-credential'
          ? 'E-mail ou senha incorretos.'
          : 'Erro ao fazer login. Tente novamente.';
      showAlert('Erro', msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        {/* Logo / Título */}
        <Text style={{ fontSize: fs(36), fontWeight: 'bold', color: colors.primary, marginBottom: 8 }}>
          💰 FinEdu
        </Text>
        <Text style={{ fontSize: fs(16), color: colors.textMuted, marginBottom: 40 }}>
          Educação Financeira Gamificada
        </Text>

        {/* Campo E-mail */}
        <Text style={{ color: colors.textSoft, marginBottom: 6, fontSize: fs(14) }}>E-mail</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          placeholderTextColor={colors.textFaint}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            backgroundColor: colors.surface,
            ...(highContrast && { borderWidth: 1, borderColor: colors.border }),
            borderRadius: 12,
            padding: 14,
            color: colors.textStrong,
            marginBottom: 16,
            fontSize: fs(16),
          }}
        />

        {/* Campo Senha */}
        <Text style={{ color: colors.textSoft, marginBottom: 6, fontSize: fs(14) }}>Senha</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 28 }}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 8 caracteres"
            placeholderTextColor={colors.textFaint}
            secureTextEntry={!showPass}
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              ...(highContrast && { borderWidth: 1, borderColor: colors.border }),
              borderRadius: 12,
              padding: 14,
              color: colors.textStrong,
              fontSize: fs(16),
            }}
          />
          <TouchableOpacity
            onPress={() => setShowPass(!showPass)}
            style={{ position: 'absolute', right: 14 }}
          >
            <Text style={{ color: colors.textSubtle, fontSize: fs(18) }}>
              {showPass ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botão Entrar */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 14,
            padding: 16,
            alignItems: 'center',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <Text style={{ color: colors.onPrimary, fontWeight: 'bold', fontSize: fs(16) }}>
              Entrar
            </Text>
          )}
        </TouchableOpacity>

        {/* Link Cadastro */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
          <Text style={{ color: colors.textSubtle, fontSize: fs(14) }}>Não tem conta? </Text>
          <Link href="/(auth)/register">
            <Text style={{ color: colors.primaryText, fontWeight: 'bold', fontSize: fs(14) }}>Cadastre-se</Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
