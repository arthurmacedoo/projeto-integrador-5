// ──────────────────────────────────────────────────────────────
// app/_layout.tsx
// Layout raiz — observer de autenticação + configuração de fontes
// ──────────────────────────────────────────────────────────────
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { onAuthChange, fetchUserProfile } from '@/services/auth.service';
import { getUserProgress } from '@/services/progress.service';
import { useUserStore } from '@/store/useUserStore';
import '../global.css';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { setUser, setLoading, setProgress, logout, uid, avatarId } = useUserStore();

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

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(app)" />
      </Stack>
    </>
  );
}
