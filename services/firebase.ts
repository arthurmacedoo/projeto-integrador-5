// ──────────────────────────────────────────────────────────────
// services/firebase.ts
// Inicialização única do Firebase SDK para o TchôEduca App
// ──────────────────────────────────────────────────────────────
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  // @ts-ignore
  getReactNativePersistence,
} from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  CACHE_SIZE_UNLIMITED,
} from 'firebase/firestore';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Obs.: o Firebase Storage foi removido — não era usado em nenhuma tela e
// adicionava peso desnecessário ao bundle baixado pelo navegador.

// ── Configuração via variáveis de ambiente (com fallback seguro) ──
const firebaseConfig = {
  apiKey:            process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'REMOVED_API_KEY',
  authDomain:        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'finedu-app-f4087.firebaseapp.com',
  projectId:         process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'finedu-app-f4087',
  storageBucket:     process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'finedu-app-f4087.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '291439180019',
  appId:             process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:291439180019:web:2376f8607bc454a5d81f86',
};

// ── Singleton: evita reinicialização em hot reload ─────────
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ── Auth com persistência condicional (React Native vs Web) ──
let authInstance;
if (getApps().length === 1) {
  if (Platform.OS === 'web') {
    authInstance = getAuth(app);
  } else {
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
} else {
  authInstance = getAuth(app);
}
export const auth = authInstance;

// ── Firestore com cache offline persistente ────────────────
// CACHE_SIZE_UNLIMITED = sem limite de tamanho local
// Estratégia: lê do cache se offline, sincroniza quando volta
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  }),
});

export default app;
