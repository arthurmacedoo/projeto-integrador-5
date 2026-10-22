// ──────────────────────────────────────────────────────────────
// app/_layout.tsx
// Layout raiz — observer de autenticação + configuração de rotas
// ──────────────────────────────────────────────────────────────
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { onAuthChange, fetchUserProfile } from '@/services/auth.service';
import { getUserProgress } from '@/services/progress.service';
import { useUserStore, createDefaultProgressMap } from '@/store/useUserStore';
import '../global.css';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { setUser, setLoading, setProgress, logout, uid, avatarId, isLoading } = useUserStore();

  useEffect(() => {
    // Observer de autenticação — roda uma vez ao montar
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        setLoading(true);
        try {
          const [profile, progress] = await Promise.race([
            Promise.all([
              fetchUserProfile(firebaseUser.uid),
              getUserProgress(firebaseUser.uid),
            ]),
            new Promise<[null, Map<string, any>]>((resolve) =>
              setTimeout(() => resolve([null, createDefaultProgressMap()]), 1500)
            ),
          ]);
          if (profile) {
            setUser({
              ...profile,
              uid: firebaseUser.uid,
              xp: profile.xp && profile.xp >= 110 ? profile.xp : 110,
            });
          } else {
            setUser({ uid: firebaseUser.uid });
          }
          setProgress(
            progress && progress.size > 0 ? progress : createDefaultProgressMap()
          );
        } catch {
          setUser({ uid: firebaseUser.uid });
          setProgress(createDefaultProgressMap());
        } finally {
          setLoading(false);
        }
      } else {
        const currentUid = useUserStore.getState().uid;
        if (currentUid !== 'demo_user') {
          logout();
        }
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Roteamento reativo baseado no estado do store
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';
    const inAvatarSelect = inOnboarding && segments[1] === 'avatar-select';
    const inWelcome = inOnboarding && !inAvatarSelect;

    if (!uid && !inAuthGroup && !inWelcome) {
      router.replace('/onboarding' as any);
    } else if (uid && !avatarId && !inAvatarSelect) {
      router.replace('/onboarding/avatar-select');
    } else if (uid && avatarId && (inAuthGroup || inOnboarding)) {
      router.replace('/(app)');
    }
  }, [uid, avatarId, segments, isLoading]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </>
  );
}
