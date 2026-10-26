// app/(app)/trails/index.tsx
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getTrails } from '@/services/trail.service';
import type { Trail } from '@/types';

export default function TrailsScreen() {
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
      <View style={{ flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <View style={{ padding: 24, paddingTop: 56 }}>
        <Text style={{ color: '#f8fafc', fontSize: 28, fontWeight: 'bold', marginBottom: 6 }}>
          Trilhas de Aprendizado 📚
        </Text>
        <Text style={{ color: '#94a3b8', fontSize: 14, marginBottom: 28 }}>
          Escolha um tema e desenvolva suas habilidades práticas
        </Text>

        {trails.map((trail) => (
          <TouchableOpacity
            key={trail.id}
            onPress={() => router.push(`/(app)/trails/${trail.id}` as any)}
            style={{
              backgroundColor: '#1e293b',
              borderRadius: 20,
              padding: 20,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: '#334155',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ fontSize: 32, marginRight: 12 }}>🛡️</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#f8fafc', fontSize: 18, fontWeight: 'bold' }}>
                  {trail.title}
                </Text>
                <Text style={{ color: '#22c55e', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
                  DISPONÍVEL NO MVP
                </Text>
              </View>
            </View>
            <Text style={{ color: '#94a3b8', fontSize: 14, lineHeight: 20, marginBottom: 16 }}>
              {trail.description}
            </Text>
            <View style={{
              backgroundColor: '#3b82f6',
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: 'center',
            }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
                Acessar Trilha ➔
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Trilhas de Expansão (v2) */}
        <Text style={{ color: '#64748b', fontSize: 13, fontWeight: 'bold', marginTop: 12, marginBottom: 12 }}>
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
              backgroundColor: '#1e293b60',
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: '#1e293b',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 26, marginRight: 14 }}>{t.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#94a3b8', fontSize: 15, fontWeight: 'bold' }}>{t.title}</Text>
              <Text style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>{t.desc}</Text>
            </View>
            <Text style={{ fontSize: 16 }}>🔒</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
