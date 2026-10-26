// components/slides/XPRewardSlide.tsx
import { View, Text } from 'react-native';

interface Props {
  xpEarned: number;
  isCorrect: boolean;
}

export default function XPRewardSlide({ xpEarned, isCorrect }: Props) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 64, marginBottom: 16 }}>
        {isCorrect ? '🏆' : '📚'}
      </Text>

      <Text style={{
        color: '#f8fafc',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
      }}>
        {isCorrect ? 'Lição Concluída com Sucesso!' : 'Lição Finalizada!'}
      </Text>

      <Text style={{
        color: '#94a3b8',
        fontSize: 15,
        marginBottom: 32,
        textAlign: 'center',
        paddingHorizontal: 20,
      }}>
        {isCorrect
          ? 'Você tomou a decisão certa e protegeu seu patrimônio!'
          : 'Errar faz parte do aprendizado. O importante é estar preparado na vida real!'}
      </Text>

      {/* Badge de Recompensa de XP */}
      <View style={{
        backgroundColor: '#1e293b',
        borderRadius: 24,
        paddingVertical: 20,
        paddingHorizontal: 36,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#f59e0b',
      }}>
        <Text style={{ color: '#f59e0b', fontSize: 13, fontWeight: 'bold', marginBottom: 4 }}>
          XP RECOMPENSA
        </Text>
        <Text style={{ color: '#fbbf24', fontSize: 40, fontWeight: 'bold' }}>
          +{xpEarned} XP
        </Text>
      </View>
    </View>
  );
}
