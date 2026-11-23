// ──────────────────────────────────────────────────────────────
// app/(auth)/register.tsx
// Tela de Cadastro — nome, e-mail e senha
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
} from 'react-native';
import { Link } from 'expo-router';
import { register } from '@/services/auth.service';
import { useUserStore } from '@/store/useUserStore';
import { useAppTheme } from '@/constants/theme';
import { showAlert } from '@/utils/alert';

export default function RegisterScreen() {
  const { colors, fs, highContrast } = useAppTheme();
  const setUser = useUserStore((s) => s.setUser);
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password) {
      showAlert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      showAlert('Atenção', 'Digite um endereço de e-mail válido.');
      return;
    }
    if (password.length < 8) {
      showAlert('Atenção', 'A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    try {
      setLoading(true);
      const uid = await register(name.trim(), email.trim(), password);
      setUser({
        uid,
        displayName: name.trim(),
        email: email.trim(),
        avatarId: null,
        avatarVariant: 1,
        xp: 0,
        level: 1,
      });
      // Observer em _layout.tsx detecta o novo usuário e redireciona
    } catch (err: any) {
      const msg =
        err.code === 'auth/email-already-in-use'
          ? 'Este e-mail já está cadastrado.'
          : err.code === 'auth/invalid-email'
            ? 'Digite um endereço de e-mail válido.'
            : err.code === 'auth/weak-password'
              ? 'Escolha uma senha mais forte (mínimo 8 caracteres).'
              : err.code === 'auth/network-request-failed'
                ? 'Sem conexão com a internet. Verifique sua rede e tente novamente.'
                : 'Erro ao criar conta. Tente novamente.';
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
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        <Text
          accessibilityRole="header"
          style={{ fontSize: fs(28), fontWeight: 'bold', color: colors.textStrong, marginBottom: 6 }}
        >
          Criar conta 🚀
        </Text>
        <Text style={{ fontSize: fs(14), color: colors.textMuted, marginBottom: 32 }}>
          Comece sua jornada financeira agora
        </Text>

        {/* Campo Nome */}
        <Text style={{ color: colors.textSoft, marginBottom: 6, fontSize: fs(14) }}>Nome</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Como podemos te chamar?"
          placeholderTextColor={colors.textFaint}
          autoCapitalize="words"
          accessibilityLabel="Nome"
          style={{
            backgroundColor: colors.surface,
            ...(highContrast && { borderWidth: 1, borderColor: colors.border }),
            borderRadius: 12,
            padding: 14,
            minHeight: 48,
            color: colors.textStrong,
            marginBottom: 16,
            fontSize: fs(16),
          }}
        />

        {/* Campo E-mail */}
        <Text style={{ color: colors.textSoft, marginBottom: 6, fontSize: fs(14) }}>E-mail</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          placeholderTextColor={colors.textFaint}
          keyboardType="email-address"
          autoCapitalize="none"
          accessibilityLabel="E-mail"
          style={{
            backgroundColor: colors.surface,
            ...(highContrast && { borderWidth: 1, borderColor: colors.border }),
            borderRadius: 12,
            padding: 14,
            minHeight: 48,
            color: colors.textStrong,
            marginBottom: 16,
            fontSize: fs(16),
          }}
        />

        {/* Campo Senha (com opção de visualização — PRD E1.F1) */}
        <Text style={{ color: colors.textSoft, marginBottom: 6, fontSize: fs(14) }}>Senha</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 28 }}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 8 caracteres"
            placeholderTextColor={colors.textFaint}
            secureTextEntry={!showPass}
            accessibilityLabel="Senha"
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              ...(highContrast && { borderWidth: 1, borderColor: colors.border }),
              borderRadius: 12,
              padding: 14,
              paddingRight: 52,
              minHeight: 48,
              color: colors.textStrong,
              fontSize: fs(16),
            }}
          />
          <TouchableOpacity
            onPress={() => setShowPass(!showPass)}
            accessibilityRole="button"
            accessibilityLabel={showPass ? 'Ocultar senha' : 'Mostrar senha'}
            style={{
              position: 'absolute',
              right: 4,
              minWidth: 48,
              minHeight: 48,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: colors.textSubtle, fontSize: fs(18) }} importantForAccessibility="no">
              {showPass ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botão Cadastrar */}
        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Criar conta"
          accessibilityState={{ disabled: loading }}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 14,
            padding: 16,
            minHeight: 52,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <Text style={{ color: colors.onPrimary, fontWeight: 'bold', fontSize: fs(16) }}>
              Criar conta
            </Text>
          )}
        </TouchableOpacity>

        {/* Link Login */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
          <Text style={{ color: colors.textSubtle, fontSize: fs(14) }}>Já tem conta? </Text>
          <Link href="/(auth)/login">
            <Text style={{ color: colors.primaryText, fontWeight: 'bold', fontSize: fs(14) }}>Entrar</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
