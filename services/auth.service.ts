// ──────────────────────────────────────────────────────────────
// services/auth.service.ts
// Serviço de autenticação — Firebase Auth (e-mail + senha)
// ──────────────────────────────────────────────────────────────
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type Unsubscribe,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import type { User as AppUser } from '@/types';

// ── Cadastro ───────────────────────────────────────────────
export async function register(
  displayName: string,
  email: string,
  password: string
): Promise<string> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const { uid } = credential.user;

  // Cria documento inicial do usuário no Firestore
  await setDoc(doc(db, 'users', uid), {
    displayName,
    email,
    avatarId: null,
    avatarVariant: 1,
    xp: 0,
    level: 1,
    createdAt: serverTimestamp(),
  });

  return uid;
}

// ── Login ──────────────────────────────────────────────────
export async function login(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
}

// ── Logout ─────────────────────────────────────────────────
export async function logout(): Promise<void> {
  await signOut(auth);
}

// ── Observer de sessão ─────────────────────────────────────
// Usado no _layout.tsx raiz para redirecionar autenticado/não autenticado
export function onAuthChange(
  callback: (user: User | null) => void
): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

// ── Busca perfil do usuário ────────────────────────────────
export async function fetchUserProfile(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    uid,
    displayName: data.displayName,
    email: data.email,
    avatarId: data.avatarId,
    avatarVariant: data.avatarVariant,
    xp: data.xp,
    level: data.level,
    createdAt: data.createdAt?.toDate() ?? new Date(),
  };
}

// ── Atualiza avatar escolhido no onboarding ────────────────
export async function updateAvatar(
  uid: string,
  avatarId: string
): Promise<void> {
  const { updateDoc, doc: firestoreDoc } = await import('firebase/firestore');
  await updateDoc(firestoreDoc(db, 'users', uid), { avatarId });
}
