// ──────────────────────────────────────────────────────────────
// services/progress.service.ts
// Gerencia progresso do usuário: completar lições, XP e nível
// ──────────────────────────────────────────────────────────────
import {
  doc,
  setDoc,
  updateDoc,
  getDocs,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { ProgressEntry } from '@/types';

// ── Marca lição como concluída e registra XP ganho ────────
export async function completeLesson(
  uid: string,
  lessonId: string,
  xpEarned: number
): Promise<void> {
  await setDoc(doc(db, 'users', uid, 'progress', lessonId), {
    completed: true,
    xpEarned,
    completedAt: serverTimestamp(),
  });
}

// ── Atualiza XP total, nível e variante do avatar ─────────
export async function updateUserXPAndLevel(
  uid: string,
  newXP: number,
  newLevel: number,
  avatarVariant: number
): Promise<void> {
  await updateDoc(doc(db, 'users', uid), {
    xp: newXP,
    level: newLevel,
    avatarVariant,
  });
}

// ── Busca todo o progresso do usuário ─────────────────────
export async function getUserProgress(
  uid: string
): Promise<Map<string, ProgressEntry>> {
  const snap = await getDocs(collection(db, 'users', uid, 'progress'));
  const map = new Map<string, ProgressEntry>();
  snap.forEach((d) => {
    map.set(d.id, {
      lessonId: d.id,
      completed: d.data().completed,
      xpEarned: d.data().xpEarned,
      completedAt: d.data().completedAt?.toDate() ?? new Date(),
    });
  });
  return map;
}
