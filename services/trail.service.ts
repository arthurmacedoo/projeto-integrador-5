// ──────────────────────────────────────────────────────────────
// services/trail.service.ts
// Busca trilhas e lições do Firestore (com suporte a cache offline)
// ──────────────────────────────────────────────────────────────
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Trail, Lesson, LessonSummary } from '@/types';

// ── Busca todas as trilhas ordenadas ──────────────────────
export async function getTrails(): Promise<Trail[]> {
  const q = query(collection(db, 'trails'), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Trail));
}

// ── Busca sumário das lições de uma trilha ────────────────
export async function getLessonsForTrail(
  trailId: string
): Promise<LessonSummary[]> {
  const q = query(
    collection(db, 'trails', trailId, 'lessons'),
    orderBy('order', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    title: d.data().title,
    order: d.data().order,
    xpReward: d.data().xpReward,
  }));
}

// ── Busca uma lição completa (com slides) ─────────────────
export async function getLesson(
  trailId: string,
  lessonId: string
): Promise<Lesson | null> {
  const snap = await getDoc(
    doc(db, 'trails', trailId, 'lessons', lessonId)
  );
  if (!snap.exists()) return null;
  return { id: snap.id, trailId, ...snap.data() } as Lesson;
}
