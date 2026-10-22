// ──────────────────────────────────────────────────────────────
// app/(app)/trails/_layout.tsx
// Stack interno da aba Trilhas (lista -> detalhe -> lição)
// Evita que sub-rotas apareçam como botões extras na Bottom Tab Bar
// ──────────────────────────────────────────────────────────────
import { Stack } from 'expo-router';

export default function TrailsStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[trailId]" />
      <Stack.Screen name="lesson/[lessonId]" />
    </Stack>
  );
}
