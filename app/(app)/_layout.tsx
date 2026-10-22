// ──────────────────────────────────────────────────────────────
// app/(app)/_layout.tsx
// Layout com Bottom Tab Bar — Apenas 3 opções: Início | Trilhas | Perfil
// ──────────────────────────────────────────────────────────────
import { Tabs, useSegments } from 'expo-router';
import { View } from 'react-native';
import {
  TabBarIconHome,
  TabBarIconTrails,
  TabBarIconProfile,
} from '@/components/ui/FinEduIcons';

function TabIconPill({
  focused,
  children,
}: {
  focused: boolean;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        backgroundColor: focused ? '#D9ECAE' : 'transparent',
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 4,
      }}
      className="items-center justify-center"
    >
      {children}
    </View>
  );
}

export default function AppLayout() {
  const segments = useSegments() as string[];
  const isLessonScreen = segments.includes('lesson');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: isLessonScreen
          ? { display: 'none' }
          : {
              backgroundColor: '#FAF8F5',
              borderTopColor: '#E5E0D5',
              borderTopWidth: 1,
              height: 68,
              paddingTop: 6,
              paddingBottom: 10,
            },
        tabBarActiveTintColor: '#1A4731',
        tabBarInactiveTintColor: '#78716C',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ focused }) => (
            <TabIconPill focused={focused}>
              <TabBarIconHome color={focused ? '#1A4731' : '#78716C'} />
            </TabIconPill>
          ),
        }}
      />
      <Tabs.Screen
        name="trails"
        options={{
          title: 'Trilhas',
          tabBarIcon: ({ focused }) => (
            <TabIconPill focused={focused}>
              <TabBarIconTrails color={focused ? '#1A4731' : '#78716C'} />
            </TabIconPill>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => (
            <TabIconPill focused={focused}>
              <TabBarIconProfile color={focused ? '#1A4731' : '#78716C'} />
            </TabIconPill>
          ),
        }}
      />
    </Tabs>
  );
}
