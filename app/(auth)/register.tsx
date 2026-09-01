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
  Alert,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { register } from '@/services/auth.service';

export default function RegisterScreen() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    try {
      setLoading(true);
      await register(name.trim(), email.trim(), password);
      // Observer em _layout.tsx detecta o novo usuário e redireciona
    } catch (err: any) {
      const msg =
        err.code === 'auth/email-already-in-use'
          ? 'Este e-mail já está cadastrado.'
          : 'Erro ao criar conta. Tente novamente.';
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
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#f1f5f9', marginBottom: 6 }}>
          Criar conta 🚀
        </Text>
        <Text style={{ fontSize: 14, color: '#94a3b8', marginBottom: 32 }}>
          Comece sua jornada financeira agora
        </Text>

        {/* Campo Nome */}
        <Text style={{ color: '#cbd5e1', marginBottom: 6, fontSize: 14 }}>Nome</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Como podemos te chamar?"
          placeholderTextColor="#475569"
          autoCapitalize="words"
          style={{
            backgroundColor: '#1e293b',
            borderRadius: 12,
            padding: 14,
            color: '#f1f5f9',
            marginBottom: 16,
            fontSize: 16,
          }}
        />

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
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Mínimo 8 caracteres"
          placeholderTextColor="#475569"
          secureTextEntry
          style={{
            backgroundColor: '#1e293b',
            borderRadius: 12,
            padding: 14,
            color: '#f1f5f9',
            marginBottom: 28,
            fontSize: 16,
          }}
        />

        {/* Botão Cadastrar */}
        <TouchableOpacity
          onPress={handleRegister}
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
              Criar conta
            </Text>
          )}
        </TouchableOpacity>

        {/* Link Login */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
          <Text style={{ color: '#64748b' }}>Já tem conta? </Text>
          <Link href="/(auth)/login">
            <Text style={{ color: '#3b82f6', fontWeight: 'bold' }}>Entrar</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
