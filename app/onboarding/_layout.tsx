// ──────────────────────────────────────────────────────────────
// app/onboarding/_layout.tsx
// Grupo de telas de onboarding pós-cadastro
// ──────────────────────────────────────────────────────────────
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
  );
}
