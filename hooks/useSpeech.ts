// ──────────────────────────────────────────────────────────────
// hooks/useSpeech.ts
// Leitura em voz alta (Text-to-Speech) em Android, iOS e navegadores
// (computador e celular). Usa a voz instalada no próprio aparelho.
//
// Cuidados por plataforma:
//  • Todas: escolhe explicitamente uma voz pt-BR (senão alguns aparelhos
//    leem o português com voz/sotaque em inglês).
//  • Chrome (PC): falas longas são cortadas após ~15s (bug conhecido do
//    navegador) → o texto é falado frase por frase.
//  • Safari / iPhone no navegador: a voz só é liberada depois de um toque
//    do usuário → "destravamos" a voz no primeiro toque/tecla na página.
//  • iOS (app): sessão de áudio própria da fala, para tocar mesmo com
//    outros áudios e respeitar interrupções do sistema.
// ──────────────────────────────────────────────────────────────
import { useCallback, useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { create } from 'zustand';
import { useAccessibilityStore, SPEECH_RATE_VALUES } from '@/store/useAccessibilityStore';

// ── Estado global da fala ──────────────────────────────────
// Um único "quem está falando agora" para o app todo: assim o botão Ouvir
// mostra "Parar" também quando a fala veio da leitura automática.
interface SpeechStatus {
  speakingText: string | null;
}
const useSpeechStatus = create<SpeechStatus>(() => ({ speakingText: null }));
let currentRun = 0; // cada fala nova invalida os callbacks da anterior

// ── Escolha da voz em português ────────────────────────────
// Cada aparelho/navegador tem vozes diferentes. Damos uma "nota" para cada voz
// em português e usamos a mais natural (as vozes "neurais", que soam como IA),
// evitando as vozes antigas do sistema, que soam robóticas e tremidas.
export interface PtVoice {
  id: string;
  label: string; // apelido cuiabano mostrado na tela de configurações
  gender?: 'feminina' | 'masculina';
  natural: boolean; // voz neural / aprimorada
}

function scoreVoice(v: Speech.Voice): number {
  const name = `${v.name} ${v.identifier}`.toLowerCase();
  let score = 0;
  if (v.language.replace('_', '-').toLowerCase().startsWith('pt-br')) score += 20;
  if (/natural|neural/.test(name)) score += 100; // Edge: Francisca, Antonio, Thalita (Natural)
  if (/premium|enhanced|aprimorad|siri/.test(name) || v.quality === Speech.VoiceQuality.Enhanced) score += 80; // iPhone/Mac
  if (/google/.test(name)) score += 60; // Chrome: "Google português do Brasil"
  if (/network/.test(name)) score += 40; // Android: vozes de rede (mais naturais)
  if (/online/.test(name)) score += 30;
  if (/compact|espeak|desktop|\bmaria\b|\bdaniel\b|\bhelia\b/.test(name)) score -= 50; // vozes antigas/robóticas
  return score;
}

// ── Apelidos cuiabanos para as vozes ───────────────────────
// Cada aparelho chama as vozes de um jeito (Francisca, Antonio, "pt-br-x-afs-network"…).
// No app, elas ganham apelidos da cultura cuiabana.
const CUIABA_NICKNAMES = ['Siriri', 'Cururu', 'Rasqueado', 'Chalana', 'Pixé', 'Furrundu', 'Mojica', 'Pintado'];

// Vozes conhecidas sempre recebem o mesmo apelido (em qualquer aparelho)
const KNOWN_VOICES: { match: RegExp; nickname: string; gender?: 'feminina' | 'masculina' }[] = [
  { match: /francisca/i, nickname: 'Siriri', gender: 'feminina' },   // Edge / Windows
  { match: /antonio/i, nickname: 'Cururu', gender: 'masculina' },    // Edge / Windows
  { match: /thalita/i, nickname: 'Rasqueado', gender: 'feminina' },  // Edge / Windows
  { match: /google/i, nickname: 'Chalana', gender: 'feminina' },     // Chrome
  { match: /luciana/i, nickname: 'Pixé', gender: 'feminina' },       // iPhone / Mac
  { match: /felipe/i, nickname: 'Furrundu', gender: 'masculina' },   // iPhone / Mac
];

const FEMALE = /francisca|thalita|luciana|joana|vit[oó]ria|leila|yara|fernanda|brenda|elza|giovanna|let[ií]cia|manuela|camila|google/i;
const MALE = /antonio|felipe|donato|f[aá]bio|humberto|j[uú]lio|nicolau|val[eé]rio|macerio/i;

// Vozes que NÃO aparecem: as de Portugal e as antigas/robóticas (Maria e Daniel, do Windows)
function isHiddenVoice(v: Speech.Voice): boolean {
  const lang = v.language.replace('_', '-').toLowerCase();
  if (!lang.startsWith('pt-br')) return true;
  return /\bmaria\b|\bdaniel\b|compact|espeak/i.test(`${v.name} ${v.identifier}`);
}

let voicesPromise: Promise<PtVoice[]> | null = null;

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([promise, new Promise<T>((r) => setTimeout(() => r(fallback), ms))]);
}

/** Vozes em português do aparelho, da mais natural para a menos natural. */
export function getPortugueseVoices(): Promise<PtVoice[]> {
  if (!voicesPromise) {
    voicesPromise = withTimeout(Speech.getAvailableVoicesAsync(), 2000, [])
      .then((voices) => {
        const allPt = voices.filter((v) => v.language.replace('_', '-').toLowerCase().startsWith('pt'));
        const visible = allPt.filter((v) => !isHiddenVoice(v));
        // Se o aparelho só tiver vozes "escondidas", usa elas mesmo (melhor falar do que ficar mudo)
        const pt = visible.length ? visible : allPt;
        const ranked = pt
          .map((v) => ({ v, score: scoreVoice(v) }))
          .sort((a, b) => b.score - a.score)
          .map(({ v, score }) => ({ v, natural: score >= 80 }));

        const used = new Set<string>();
        const named = ranked.map(({ v, natural }) => {
          const who = `${v.name} ${v.identifier}`;
          const known = KNOWN_VOICES.find((k) => k.match.test(who) && !used.has(k.nickname));
          const gender = known?.gender ?? (FEMALE.test(who) ? 'feminina' : MALE.test(who) ? 'masculina' : undefined);
          if (known) used.add(known.nickname);
          return { v, natural, nickname: known?.nickname, gender };
        });
        const list: PtVoice[] = named.map(({ v, natural, nickname, gender }) => {
          const nick = nickname ?? CUIABA_NICKNAMES.find((n) => !used.has(n)) ?? `Voz ${used.size + 1}`;
          used.add(nick);
          return { id: v.identifier, label: nick, gender, natural };
        });
        if (!list.length) {
          // Guarda o "não tem" por 10s (para não atrasar cada toque) e depois verifica de novo,
          // porque em alguns navegadores/aparelhos as vozes carregam mais tarde.
          setTimeout(() => {
            voicesPromise = null;
          }, 10000);
        }
        return list;
      })
      .catch(() => {
        setTimeout(() => {
          voicesPromise = null;
        }, 10000);
        return [];
      });
  }
  return voicesPromise;
}

/** A voz a usar: a escolhida pelo usuário (se ainda existir no aparelho) ou a mais natural. */
export async function getPortugueseVoice(preferredId?: string | null): Promise<string | undefined> {
  const voices = await getPortugueseVoices();
  if (preferredId && voices.some((v) => v.id === preferredId)) return preferredId;
  return voices[0]?.id;
}

/** Lista de vozes + situação ('checking' | 'ok' | 'missing'), para a tela de configurações. */
export function usePortugueseVoices() {
  const [state, setState] = useState<{ status: 'checking' | 'ok' | 'missing'; voices: PtVoice[] }>({
    status: 'checking',
    voices: [],
  });
  useEffect(() => {
    let alive = true;
    getPortugueseVoices().then((voices) => {
      if (alive) setState({ status: voices.length ? 'ok' : 'missing', voices });
    });
    return () => {
      alive = false;
    };
  }, []);
  return state;
}

/** Compatibilidade: só a situação. */
export function usePortugueseVoiceStatus() {
  return usePortugueseVoices().status;
}

// ── Divide o texto em pedaços curtos (frases) ──────────────
export function splitIntoChunks(text: string, max = 180): string[] {
  const clean = text.replace(/\s+/g, ' ').trim();
  const sentences = clean.match(/[^.!?…]+[.!?…]*["”']?\s*/g) ?? [clean];
  const parts: string[] = [];
  for (const s of sentences) {
    if (s.length <= max) parts.push(s);
    else parts.push(...(s.match(/[^,;]+[,;]?\s*/g) ?? [s])); // frase muito longa: quebra nas vírgulas
  }
  const chunks: string[] = [];
  let cur = '';
  for (const p of parts) {
    if (cur && (cur + p).length > max) {
      chunks.push(cur.trim());
      cur = p;
    } else {
      cur += p;
    }
  }
  if (cur.trim()) chunks.push(cur.trim());
  return chunks;
}

// ── Navegador: destrava a voz no primeiro toque/tecla ─────
if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const unlock = () => {
    try {
      const u = new SpeechSynthesisUtterance(' ');
      u.volume = 0;
      window.speechSynthesis.speak(u);
      window.speechSynthesis.getVoices(); // começa a carregar a lista de vozes
    } catch {
      /* navegador sem suporte: o botão Ouvir simplesmente não fala */
    }
    window.removeEventListener('pointerdown', unlock, true);
    window.removeEventListener('keydown', unlock, true);
  };
  window.addEventListener('pointerdown', unlock, true);
  window.addEventListener('keydown', unlock, true);
}

// ── Funções de falar / parar (globais) ─────────────────────
function stopSpeaking() {
  currentRun++;
  Speech.stop();
  useSpeechStatus.setState({ speakingText: null });
}

async function startSpeaking(text: string, rate: number, voiceId?: string | null) {
  if (!text?.trim()) return;
  const run = ++currentRun;
  Speech.stop();
  useSpeechStatus.setState({ speakingText: text });

  const voice = await getPortugueseVoice(voiceId);
  // Chrome às vezes ignora uma fala pedida logo depois de cancelar a anterior
  if (Platform.OS === 'web') await new Promise((r) => setTimeout(r, 60));
  if (run !== currentRun) return; // outra fala começou (ou parou) enquanto esperávamos

  const finish = () => {
    if (run === currentRun) useSpeechStatus.setState({ speakingText: null });
  };
  const chunks = splitIntoChunks(text);
  chunks.forEach((chunk, i) => {
    Speech.speak(chunk, {
      language: 'pt-BR',
      voice,
      rate,
      useApplicationAudioSession: false, // iOS: sessão de áudio própria da fala
      onDone: i === chunks.length - 1 ? finish : undefined,
      onStopped: finish,
      onError: finish,
    });
  });
}

// ── Hook usado pelos componentes ───────────────────────────
export function useSpeech(text?: string) {
  const speechSpeed = useAccessibilityStore((s) => s.speechSpeed);
  const voiceId = useAccessibilityStore((s) => s.voiceId);
  const speakingText = useSpeechStatus((s) => s.speakingText);

  const speak = useCallback(
    (t: string) => startSpeaking(t, SPEECH_RATE_VALUES[speechSpeed], voiceId),
    [speechSpeed, voiceId]
  );

  // Ao sair da tela / trocar de slide: se este texto estava sendo lido, para.
  useEffect(
    () => () => {
      if (text && useSpeechStatus.getState().speakingText === text) stopSpeaking();
    },
    [text]
  );

  return {
    speak,
    stop: stopSpeaking,
    isSpeaking: text ? speakingText === text : speakingText !== null,
  };
}

/**
 * Lê o texto automaticamente quando o slide aparece, se o usuário ativou
 * "Ler lições automaticamente". No celular, não lê se o TalkBack/VoiceOver
 * estiver ligado, para as duas vozes não falarem por cima uma da outra.
 */
export function useAutoRead(text: string) {
  const autoRead = useAccessibilityStore((s) => s.autoRead);
  const { speak } = useSpeech(text);

  useEffect(() => {
    if (!autoRead) return;
    let cancelled = false;
    // Na web o React Native não consegue detectar leitor de tela (sempre responde "ligado"),
    // então a verificação só vale para Android/iOS.
    const check =
      Platform.OS === 'web' ? Promise.resolve(false) : AccessibilityInfo.isScreenReaderEnabled();
    check.then((screenReaderOn) => {
      if (!cancelled && !screenReaderOn) speak(text);
    });
    return () => {
      cancelled = true;
    };
  }, [autoRead, text, speak]);
}

// Já começa a procurar as vozes em português quando o app abre,
// para o primeiro toque em "Ouvir" ser imediato.
getPortugueseVoices();

/** Fala uma frase de exemplo com uma velocidade/voz específica (usado na tela de configurações). */
export function speakSample(text: string, rate: number, voiceId?: string | null) {
  return startSpeaking(text, rate, voiceId);
}
