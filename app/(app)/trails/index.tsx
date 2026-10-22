// ──────────────────────────────────────────────────────────────
// app/(app)/trails/index.tsx
// Lista de Trilhas — Idêntico à Tela 8 do PDF FinEdu
// ──────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getTrails } from '@/services/trail.service';
import { useUserStore } from '@/store/useUserStore';
import type { Trail } from '@/types';
import {
  ShieldHeroIllustration,
  IconShieldOutline,
  IconBudget,
  IconUmbrella,
  IconStore,
  IconLock,
} from '@/components/ui/FinEduIcons';

const FALLBACK_TRAIL: Trail = {
  id: 'trail_golpes',
  title: 'Golpes Pix/WhatsApp',
  description: 'Identifique armadilhas e proteja seus dados antes de pagar.',
  order: 1,
  isLocked: false,
  iconName: 'shield-alert',
  color: '#1A4731',
};

export default function TrailsScreen() {
  const router = useRouter();
  const { completedLessons } = useUserStore();
  const [trails, setTrails] = useState<Trail[]>([FALLBACK_TRAIL]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await Promise.race([
          getTrails(),
          new Promise<Trail[]>((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 1200)
          ),
        ]);
        if (data.length > 0) {
          setTrails(data);
        }
      } catch {
        // Mantém FALLBACK_TRAIL
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <View
        style={{ flex: 1, backgroundColor: '#F7F6F0' }}
        className="justify-center items-center"
      >
        <ActivityIndicator size="large" color="#1A4731" />
      </View>
    );
  }

  const totalLessons = 8;
  const completedCount = Math.min(completedLessons.size, totalLessons);
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F6F0' }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: '#F7F6F0' }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-8 pb-8">
          {/* Header */}
          <View
            style={{ backgroundColor: '#E5ECD8' }}
            className="rounded-md px-2.5 py-1 self-start mb-2.5"
          >
            <Text
              style={{ color: '#1A4731' }}
              className="text-[10px] font-extrabold tracking-widest uppercase"
            >
              SEU APRENDIZADO
            </Text>
          </View>

          <Text className="text-ink text-2xl font-extrabold leading-tight mb-1.5">
            Uma escolha melhor a cada lição.
          </Text>
          <Text className="text-ink-muted text-xs leading-relaxed mb-5">
            Histórias curtas para usar na vida real. Escolha por onde continuar.
          </Text>

          {/* Trilhas Disponíveis */}
          {trails.map((trail) => (
            <TouchableOpacity
              key={trail.id}
              activeOpacity={0.9}
              onPress={() => router.push(`/(app)/trails/${trail.id}` as any)}
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E6E2D6',
                borderWidth: 1,
              }}
              className="rounded-3xl p-4 mb-6"
            >
              {/* Banner Ilustrado do Escudo no Topo do Card */}
              <View
                style={{ backgroundColor: '#EFECE4' }}
                className="rounded-2xl py-4 items-center justify-center mb-4 overflow-hidden"
              >
                <ShieldHeroIllustration variant="check" compact />
              </View>

              {/* Badge DISPONÍVEL */}
              <View
                style={{ backgroundColor: '#E5ECD8' }}
                className="px-2.5 py-1 rounded-md self-start flex-row items-center mb-2.5"
              >
                <View className="mr-1.5">
                  <IconShieldOutline size={12} color="#1A4731" />
                </View>
                <Text
                  style={{ color: '#1A4731' }}
                  className="text-[10px] font-extrabold tracking-wider uppercase"
                >
                  DISPONÍVEL
                </Text>
              </View>

              <Text className="text-ink text-xl font-extrabold mb-1">
                Golpes Pix/WhatsApp
              </Text>
              <Text className="text-ink-muted text-xs leading-relaxed mb-3">
                Identifique armadilhas e proteja seus dados antes de pagar.
              </Text>

              <Text className="text-ink text-xs font-extrabold mb-3">
                8 lições · Até 570 XP
              </Text>

              {/* Progresso */}
              <View className="flex-row items-center justify-between mb-1.5">
                <Text className="text-ink-muted text-xs">
                  {completedCount} de {totalLessons} concluídas
                </Text>
                <Text className="text-ink text-xs font-extrabold">
                  {progressPercent}%
                </Text>
              </View>
              <View
                style={{ backgroundColor: '#E6E2D6' }}
                className="rounded-full h-2 overflow-hidden mb-4"
              >
                <View
                  style={{
                    width: `${Math.max(8, progressPercent)}%`,
                    backgroundColor: '#1A4731',
                  }}
                  className="h-full rounded-full"
                />
              </View>

              {/* Botão Ver trilha */}
              <View
                style={{ backgroundColor: '#1A4731' }}
                className="w-full rounded-full py-3.5 px-5 flex-row items-center justify-center"
              >
                <Text className="text-white font-bold text-xs mr-1.5">
                  Ver trilha
                </Text>
                <Text className="text-white font-bold text-xs">→</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Trilhas Futuras */}
          <Text className="text-ink text-base font-extrabold mb-0.5">
            Novos caminhos vêm aí
          </Text>
          <Text className="text-ink-muted text-xs mb-3.5">
            Estas trilhas ainda não estão disponíveis.
          </Text>

          {[
            { title: 'Orçamento Pessoal', Icon: IconBudget },
            { title: 'Reserva de Emergência', Icon: IconUmbrella },
            { title: 'Formalização MEI', Icon: IconStore },
          ].map(({ title, Icon }) => (
            <View
              key={title}
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E6E2D6',
                borderWidth: 1,
              }}
              className="rounded-2xl p-3.5 mb-2.5 flex-row items-center justify-between"
            >
              <View className="flex-row items-center flex-1 mr-3">
                <View
                  style={{ backgroundColor: '#EFECE4' }}
                  className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                >
                  <Icon size={18} color="#57534E" />
                </View>
                <View>
                  <Text className="text-ink font-bold text-xs">{title}</Text>
                  <Text className="text-ink-subtle text-[11px] mt-0.5">
                    Em breve
                  </Text>
                </View>
              </View>
              <IconLock size={16} color="#A8A29E" />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
