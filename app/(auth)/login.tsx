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
  Alert,
} from 'react-native';
import { Link } from 'expo-router';
import { login } from '@/services/auth.service';

export default function LoginScreen() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
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
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#0f172a' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        {/* Logo / Título */}
        <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#3b82f6', marginBottom: 8 }}>
          💰 FinEdu
        </Text>
        <Text style={{ fontSize: 16, color: '#94a3b8', marginBottom: 40 }}>
          Educação Financeira Gamificada
        </Text>

        {/* Campo E-mail */}
        <Text style={{ color: '#cbd5e1', marginBottom: 6, fontSize: 14 }}>E-mail</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          placeholderTextColor="#475569"
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            backgroundColor: '#1e293b',
            borderRadius: 12,
            padding: 14,
            color: '#f1f5f9',
            marginBottom: 16,
            fontSize: 16,
          }}
        />

        {/* Campo Senha */}
        <Text style={{ color: '#cbd5e1', marginBottom: 6, fontSize: 14 }}>Senha</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 28 }}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 8 caracteres"
            placeholderTextColor="#475569"
            secureTextEntry={!showPass}
            style={{
              flex: 1,
              backgroundColor: '#1e293b',
              borderRadius: 12,
              padding: 14,
              color: '#f1f5f9',
              fontSize: 16,
            }}
          />
          <TouchableOpacity
            onPress={() => setShowPass(!showPass)}
            style={{ position: 'absolute', right: 14 }}
          >
            <Text style={{ color: '#64748b', fontSize: 18 }}>
              {showPass ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botão Entrar */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={{
            backgroundColor: '#3b82f6',
            borderRadius: 14,
            padding: 16,
            alignItems: 'center',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
              Entrar
            </Text>
          )}
        </TouchableOpacity>

        {/* Link Cadastro */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
          <Text style={{ color: '#64748b' }}>Não tem conta? </Text>
          <Link href="/(auth)/register">
            <Text style={{ color: '#3b82f6', fontWeight: 'bold' }}>Cadastre-se</Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
