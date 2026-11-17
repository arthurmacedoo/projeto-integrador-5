// ──────────────────────────────────────────────────────────────
// services/trail.service.ts
// Busca trilhas e lições do Firestore (com suporte a cache e fallback local offline)
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
import { ALL_LESSONS } from '@/constants/lessons';
import type { Trail, Lesson, LessonSummary } from '@/types';

const FALLBACK_TRAILS: Trail[] = [
  {
    id: 'trail_golpes',
    title: 'Golpes Pix e WhatsApp',
    description:
      'Aprenda na prática a identificar fraudes digitais, proteger seu dinheiro e blindar seus dados.',
    order: 1,
    isLocked: false,
    iconName: 'shield-alert',
    color: '#3b82f6',
  },
];

// ── Busca todas as trilhas ordenadas ──────────────────────
export async function getTrails(): Promise<Trail[]> {
  try {
    const q = query(collection(db, 'trails'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Trail));
    }
  } catch (err) {
    console.warn('Usando fallback local de trilhas:', err);
  }
  return FALLBACK_TRAILS;
}

// ── Busca sumário das lições de uma trilha ────────────────
export async function getLessonsForTrail(
  trailId: string
): Promise<LessonSummary[]> {
  try {
    const q = query(
      collection(db, 'trails', trailId, 'lessons'),
      orderBy('order', 'asc')
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => ({
        id: d.id,
        title: d.data().title,
        order: d.data().order,
        xpReward: d.data().xpReward,
      }));
    }
  } catch (err) {
    console.warn('Usando fallback local de lista de lições:', err);
  }
  return Object.values(ALL_LESSONS)
    .filter((l) => l.trailId === trailId || trailId === 'trail_golpes')
    .sort((a, b) => a.order - b.order)
    .map((l) => ({
      id: l.id,
      title: `${l.order}. ${l.title}`,
      order: l.order,
      xpReward: l.xpReward,
    }));
}

// ── Busca uma lição completa (com slides) ─────────────────
export async function getLesson(
  trailId: string,
  lessonId: string
): Promise<Lesson | null> {
  try {
    const snap = await getDoc(
      doc(db, 'trails', trailId, 'lessons', lessonId)
    );
    if (snap.exists()) {
      return { id: snap.id, trailId, ...snap.data() } as Lesson;
    }
  } catch (err) {
    console.warn('Usando fallback local da lição:', err);
  }
  return ALL_LESSONS[lessonId] ?? null;
}
