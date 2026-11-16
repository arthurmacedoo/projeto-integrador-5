// ──────────────────────────────────────────────────────────────
// app/(app)/_layout.tsx
// Layout com Bottom Tab Bar — Home | Trilhas | Perfil
// ──────────────────────────────────────────────────────────────
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useAppTheme } from '@/constants/theme';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text importantForAccessibility="no" style={{ fontSize: focused ? 24 : 20, opacity: focused ? 1 : 0.5 }}>
      {emoji}
    </Text>
  );
}

export default function AppLayout() {
  const { colors, fs, highContrast } = useAppTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: highContrast ? colors.border : colors.surface,
          borderTopWidth: 1,
          // A altura cresce junto com o tamanho do texto escolhido
          height: 46 + fs(14),
          paddingBottom: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarLabelStyle: { fontSize: fs(11), fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="trails/index"
        options={{
          title: 'Trilhas',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📚" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
      {/* Rotas internas: existem, mas não viram abas na bottom-bar.
          (Antes apareciam como abas extras "trails/[trailId]" e "trails/lesson/...") */}
      <Tabs.Screen name="trails/[trailId]" options={{ href: null }} />
      <Tabs.Screen
        name="trails/lesson/[lessonId]"
        options={{ href: null, tabBarStyle: { display: 'none' } }} // lição em tela cheia
      />
      {/* Tela de Acessibilidade: aberta pelo Perfil */}
      <Tabs.Screen
        name="accessibility"
        options={{ href: null, title: 'Acessibilidade' }}
      />
    </Tabs>
  );
}
