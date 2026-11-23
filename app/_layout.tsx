// ──────────────────────────────────────────────────────────────
// app/_layout.tsx
// Layout raiz — observer de autenticação + configuração de fontes
// ──────────────────────────────────────────────────────────────
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, Platform, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useShallow } from 'zustand/react/shallow';
import { onAuthChange, fetchUserProfile } from '@/services/auth.service';
import { getUserProgress } from '@/services/progress.service';
import { useUserStore } from '@/store/useUserStore';
import { useAppTheme } from '@/constants/theme';
import OfflineBanner from '@/components/ui/OfflineBanner';
import '../global.css';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  // Ações do store são estáveis: pegar só elas (e uid/avatarId/isLoading) evita
  // re-renderizar o layout raiz inteiro a cada mudança de XP/progresso.
  const { setUser, setLoading, setProgress, logout, uid, avatarId, isLoading } = useUserStore(
    useShallow((s) => ({
      setUser: s.setUser,
      setLoading: s.setLoading,
      setProgress: s.setProgress,
      logout: s.logout,
      uid: s.uid,
      avatarId: s.avatarId,
      isLoading: s.isLoading,
    }))
  );
  const { colors } = useAppTheme();

  // Web (computador/celular no navegador): idioma da página e foco visível no teclado
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    // Leitores de tela do PC (NVDA, JAWS, VoiceOver) usam isto para escolher a pronúncia
    document.documentElement.lang = 'pt-BR';
    document.title = 'TchôEduca';
    // Contorno amarelo bem visível em quem está com o foco ao navegar com Tab
    if (!document.getElementById('tchoeduca-a11y-focus')) {
      const style = document.createElement('style');
      style.id = 'tchoeduca-a11y-focus';
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
          } else {
            // Caso o documento ainda esteja sendo criado (ex: logo após cadastro)
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email ?? '',
            });
          }
        } catch {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? '',
          });
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
    // Aguarda o Firebase restaurar a sessão: evita "piscar" a tela de login
    // para quem já está logado ao abrir/recarregar o link.
    if (isLoading) return;

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
  }, [uid, avatarId, segments, isLoading]);

  const stack = (
    <>
      <StatusBar style="light" />
      <OfflineBanner />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(app)" />
      </Stack>
      {/* Tela de carregamento enquanto a sessão é restaurada (o Stack continua
          montado por baixo, pois o router precisa dele para redirecionar). */}
      {isLoading && (
        <View
          accessibilityLabel="Carregando TchôEduca"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
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
