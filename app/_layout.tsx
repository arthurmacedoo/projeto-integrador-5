// ──────────────────────────────────────────────────────────────
// app/_layout.tsx
// Layout raiz — observer de autenticação + configuração de fontes
// ──────────────────────────────────────────────────────────────
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { Platform, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { onAuthChange, fetchUserProfile } from '@/services/auth.service';
import { getUserProgress } from '@/services/progress.service';
import { useUserStore } from '@/store/useUserStore';
import { useAppTheme } from '@/constants/theme';
import '../global.css';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { setUser, setLoading, setProgress, logout, uid, avatarId } = useUserStore();
  const { colors } = useAppTheme();

  // Web (computador/celular no navegador): idioma da página e foco visível no teclado
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    // Leitores de tela do PC (NVDA, JAWS, VoiceOver) usam isto para escolher a pronúncia
    document.documentElement.lang = 'pt-BR';
    document.title = 'FinEdu';
    // Contorno amarelo bem visível em quem está com o foco ao navegar com Tab
    if (!document.getElementById('finedu-a11y-focus')) {
      const style = document.createElement('style');
      style.id = 'finedu-a11y-focus';
      style.textContent =
        '*:focus-visible { outline: 3px solid #ffd600 !important; outline-offset: 2px !important; border-radius: 8px; }';
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    // Observer de autenticação — roda uma vez ao montar
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Usuário autenticado: busca perfil e progresso
        setLoading(true);
        try {
          const [profile, progress] = await Promise.all([
            fetchUserProfile(firebaseUser.uid),
            getUserProgress(firebaseUser.uid),
          ]);
          if (profile) {
            setUser({ ...profile, uid: firebaseUser.uid });
            setProgress(progress);
          }
        } finally {
          setLoading(false);
        }
      } else {
        // Sem sessão: limpa o store
        logout();
        setLoading(false);
      }
    });

    return unsubscribe; // cleanup ao desmontar
  }, []);

  // Roteamento reativo baseado no estado do store
  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';

    if (!uid && !inAuthGroup) {
      // Não autenticado → Login
      router.replace('/(auth)/login');
    } else if (uid && !avatarId && !inOnboarding) {
      // Autenticado mas sem avatar → Seleção de avatar
      router.replace('/onboarding/avatar-select');
    } else if (uid && avatarId && (inAuthGroup || inOnboarding)) {
      // Autenticado com avatar → Home
      router.replace('/(app)');
    }
  }, [uid, avatarId, segments]);

  const stack = (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(app)" />
      </Stack>
    </>
  );

  if (Platform.OS !== 'web') return stack;

  // Web (navegador do PC): app centralizado em "formato celular", 480px.
  return (
    <View style={{ flex: 1, backgroundColor: '#020617' }}>
      <View
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 480,
          alignSelf: 'center',
          backgroundColor: colors.background,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: colors.border,
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.6)',
        }}
      >
        {stack}
      </View>
    </View>
  );
}
