// ──────────────────────────────────────────────────────────────
// components/ui/OfflineBanner.tsx
// Banner sutil exibido automaticamente quando o navegador está offline (PRD CA-05).
// ──────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { useAppTheme } from '@/constants/theme';

export default function OfflineBanner() {
  const { colors, fs, highContrast } = useAppTheme();
  const [offline, setOffline] = useState(
    Platform.OS === 'web' && typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <View
      accessibilityRole="alert"
      style={{
        backgroundColor: highContrast ? colors.background : colors.warningSoft,
        borderBottomWidth: highContrast ? 2 : 1,
        borderBottomColor: colors.warningBase,
        paddingVertical: 10,
        paddingHorizontal: 16,
      }}
    >
      <Text
        style={{
          color: colors.warning,
          fontSize: fs(13),
          fontWeight: '600',
          textAlign: 'center',
        }}
      >
        📡 Você está offline — usando lições em cache local. Seu progresso será sincronizado quando a conexão voltar.
      </Text>
    </View>
  );
}
