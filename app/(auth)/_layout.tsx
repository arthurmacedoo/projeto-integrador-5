// ──────────────────────────────────────────────────────────────
// app/(auth)/_layout.tsx
// Grupo de telas sem bottom bar (Login + Cadastro)
// ──────────────────────────────────────────────────────────────
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
  );
}
