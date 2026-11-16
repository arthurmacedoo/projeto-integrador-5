// app/(app)/trails/index.tsx
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getTrails } from '@/services/trail.service';
import type { Trail } from '@/types';
import { useAppTheme } from '@/constants/theme';

export default function TrailsScreen() {
  const { colors, fs, highContrast } = useAppTheme();
  const router = useRouter();
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getTrails();
        setTrails(data);
      } catch (err) {
        console.error('Erro ao carregar trilhas:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 24, paddingTop: 56 }}>
        <Text style={{ color: colors.text, fontSize: fs(28), fontWeight: 'bold', marginBottom: 6 }}>
          Trilhas de Aprendizado 📚
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: fs(14), marginBottom: 28 }}>
          Escolha um tema e desenvolva suas habilidades práticas
        </Text>

        {trails.map((trail) => (
          <TouchableOpacity
            key={trail.id}
            onPress={() => router.push(`/(app)/trails/${trail.id}` as any)}
            style={{
              backgroundColor: colors.surface,
              ...(highContrast && { borderWidth: 1, borderColor: colors.border }),
              borderRadius: 20,
              padding: 20,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ fontSize: fs(32), marginRight: 12 }}>🛡️</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontSize: fs(18), fontWeight: 'bold' }}>
                  {trail.title}
                </Text>
                <Text style={{ color: colors.successBase, fontSize: fs(12), fontWeight: '600', marginTop: 2 }}>
                  DISPONÍVEL NO MVP
                </Text>
              </View>
            </View>
            <Text style={{ color: colors.textMuted, fontSize: fs(14), lineHeight: fs(20), marginBottom: 16 }}>
              {trail.description}
            </Text>
            <View style={{
              backgroundColor: colors.primary,
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: 'center',
            }}>
              <Text style={{ color: colors.onPrimary, fontWeight: 'bold', fontSize: fs(14) }}>
                Acessar Trilha ➔
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Trilhas de Expansão (v2) */}
        <Text style={{ color: colors.textSubtle, fontSize: fs(13), fontWeight: 'bold', marginTop: 12, marginBottom: 12 }}>
          PRÓXIMAS TRILHAS EM DESENVOLVIMENTO
        </Text>

        {[
          { title: 'Orçamento Pessoal & Familiar', emoji: '💰', desc: 'Controle de entradas, saídas e eliminação de dívidas.' },
          { title: 'Reserva de Emergência', emoji: '🚨', desc: 'Como guardar os primeiros R$ 1.000 com segurança.' },
          { title: 'Formalização MEI na Prática', emoji: '📋', desc: 'Passo a passo para emitir nota e pagar DAS sem medo.' },
        ].map((t) => (
          <View
            key={t.title}
            style={{
              backgroundColor: colors.surfaceSoft,
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: highContrast ? colors.border : colors.surface,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: fs(26), marginRight: 14 }}>{t.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.textMuted, fontSize: fs(15), fontWeight: 'bold' }}>{t.title}</Text>
              <Text style={{ color: colors.textSubtle, fontSize: fs(12), marginTop: 2 }}>{t.desc}</Text>
            </View>
            <Text style={{ fontSize: fs(16) }}>🔒</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
