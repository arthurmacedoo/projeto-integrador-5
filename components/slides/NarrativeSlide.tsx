// ──────────────────────────────────────────────────────────────
// components/slides/NarrativeSlide.tsx
// Slide 1 de 4 · A história (Idêntico à Tela 10 do PDF FinEdu)
// ──────────────────────────────────────────────────────────────
import { View, Text, ScrollView } from 'react-native';
import type { NarrativeSlide as NarrativeSlideType } from '@/types';
import {
  AvatarPortrait,
  IconEarbuds,
  IconClock,
} from '@/components/ui/FinEduIcons';

interface Props {
  slide: NarrativeSlideType;
  lessonTitle?: string;
}

const CHARACTER_INFO: Record<
  string,
  { avatarId: string; greeting: string; bio: string }
> = {
  joao: {
    avatarId: 'joao',
    greeting: 'Este é o João.',
    bio: '25 anos, trabalhador e de olho em um fone novo.',
  },
  dona_cida: {
    avatarId: 'avatar_5',
    greeting: 'Esta é a Dona Cida.',
    bio: 'Mãe dedicada que usa o WhatsApp para falar com a família.',
  },
  carlos: {
    avatarId: 'avatar_4',
    greeting: 'Este é o Carlos.',
    bio: 'Autônomo atento às oportunidades e contas do mês.',
  },
  assistente: {
    avatarId: 'avatar_1',
    greeting: 'Guia TchôEduca',
    bio: 'Situação prática do dia a dia.',
  },
};

export default function NarrativeSlide({ slide, lessonTitle }: Props) {
  const char = CHARACTER_INFO[slide.character] ?? CHARACTER_INFO.joao;

  const cleanTitle = lessonTitle
    ? lessonTitle.replace(/^\d+\.\s*/, '')
    : 'A Promoção Imperdível';

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 12 }}
    >
      {/* Título da Lição */}
      <Text className="text-ink text-2xl font-extrabold leading-tight mb-4">
        {cleanTitle}
      </Text>

      {/* Card de Apresentação do Personagem */}
      <View
        style={{ backgroundColor: '#EFECE4' }}
        className="rounded-2xl p-3.5 flex-row items-center mb-4"
      >
        <View className="mr-3.5">
          <AvatarPortrait id={char.avatarId} size={48} />
        </View>
        <View className="flex-1">
          <Text className="text-ink font-extrabold text-sm mb-0.5">
            {char.greeting}
          </Text>
          <Text className="text-ink-muted text-xs leading-snug">
            {char.bio}
          </Text>
        </View>
      </View>

      {/* Texto da História */}
      <Text className="text-ink text-sm leading-relaxed mb-4">
        {slide.text}
      </Text>

      {/* Card de Simulação: EXEMPLO · ANÚNCIO FICTÍCIO */}
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: '#E3DFD3',
          borderWidth: 1,
        }}
        className="rounded-3xl p-4 mb-4"
      >
        <Text className="text-ink-subtle text-[10px] font-extrabold tracking-widest uppercase mb-3">
          EXEMPLO · ANÚNCIO FICTÍCIO
        </Text>

        <View className="flex-row items-center mb-3">
          <View
            style={{ backgroundColor: '#EFECE4' }}
            className="w-11 h-11 rounded-xl items-center justify-center mr-3"
          >
            <IconEarbuds size={22} color="#78716C" />
          </View>
          <Text className="text-ink font-extrabold text-sm flex-1 leading-snug">
            Fone sem fio com superdesconto!
          </Text>
        </View>

        <View className="flex-row items-baseline gap-2 mb-2.5">
          <Text className="text-ink-subtle text-xs line-through">
            R$ 299
          </Text>
          <Text className="text-ink text-2xl font-extrabold">
            R$ 49
          </Text>
        </View>

        <Text className="text-ink-muted text-xs leading-relaxed mb-3.5">
          “Só até as 18h! Pague por Pix para garantir. Veja os depoimentos aqui no anúncio.”
        </Text>

        <View
          style={{
            backgroundColor: '#F7EED2',
            borderColor: '#E8D49B',
            borderWidth: 1,
          }}
          className="rounded-full px-3 py-1.5 self-start flex-row items-center"
        >
          <View className="mr-1.5">
            <IconClock size={12} color="#8C5E14" />
          </View>
          <Text style={{ color: '#57534E' }} className="text-[11px] font-bold">
            Oferta com pressa de vender
          </Text>
        </View>
      </View>

      {/* Pergunta de Reflexão */}
      <Text className="text-ink-muted text-xs leading-relaxed">
        O preço chama a atenção. Mas será que essa compra é segura?
      </Text>
    </ScrollView>
  );
}
