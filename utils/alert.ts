// ──────────────────────────────────────────────────────────────
// utils/alert.ts
// Alertas que funcionam em Android, iOS E navegador.
// (O Alert.alert do React Native não faz nada na web: o botão "Sair"
//  e as mensagens de erro de login simplesmente não apareciam no PC.)
// ──────────────────────────────────────────────────────────────
import { Alert, Platform } from 'react-native';

/** Mensagem simples com botão OK. */
export function showAlert(title: string, message?: string) {
  if (Platform.OS === 'web') {
    window.alert(message ? `${title}\n\n${message}` : title);
  } else {
    Alert.alert(title, message);
  }
}

/** Pergunta de confirmação (Cancelar / ação). Chama onConfirm se o usuário confirmar. */
export function confirmAction(
  title: string,
  message: string,
  confirmText: string,
  onConfirm: () => void,
  destructive = true
) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancelar', style: 'cancel' },
    { text: confirmText, style: destructive ? 'destructive' : 'default', onPress: onConfirm },
  ]);
}
