// ──────────────────────────────────────────────────────────────
// hooks/useSpeech.ts
// Leitura em voz alta (Text-to-Speech) em Android, iOS e navegadores
// (computador e celular). Usa a voz instalada no próprio aparelho.
//
// Cuidados por plataforma:
//  • Todas: escolhe explicitamente uma voz pt-BR (senão alguns aparelhos
//    leem o português com voz/sotaque em inglês).
//  • Web (Chrome/Edge): escuta o evento `voiceschanged` para detectar vozes
//    carregadas de forma assíncrona sem ficar travado em "sem voz".
//  • Chrome (PC): falas longas são cortadas após ~15s (bug conhecido do
//    navegador) → o texto é falado frase por frase sem quebrar números/URLs.
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

// ── Verificação segura de suporte à fala ───────────────────
function hasSpeechSupport(): boolean {
  if (Platform.OS !== 'web') return true;
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// ── Estado global da fala ──────────────────────────────────
// Um único "quem está falando agora" para o app todo: assim o botão Ouvir
// mostra "Parar" também quando a fala veio da leitura automática.
interface SpeechStatus {
  speakingText: string | null;
}
const useSpeechStatus = create<SpeechStatus>(() => ({ speakingText: null }));
let currentRun = 0; // cada fala nova invalida os callbacks da anterior

// ── Escolha da voz em português ────────────────────────────
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
// Vozes conhecidas sempre recebem o mesmo apelido (em qualquer aparelho).
const KNOWN_VOICES: { match: RegExp; nickname: string; gender?: 'feminina' | 'masculina' }[] = [
  { match: /francisca/i, nickname: 'Siriri', gender: 'feminina' },   // Edge / Windows (neural)
  { match: /antonio/i, nickname: 'Cururu', gender: 'masculina' },    // Edge / Windows (neural)
  { match: /thalita/i, nickname: 'Rasqueado', gender: 'feminina' },  // Edge / Windows (neural)
  { match: /google/i, nickname: 'Chalana', gender: 'feminina' },     // Chrome
  { match: /luciana/i, nickname: 'Pixé', gender: 'feminina' },       // iPhone / Mac
  { match: /felipe/i, nickname: 'Furrundu', gender: 'masculina' },   // iPhone / Mac
];

// Apelidos para vozes alternativas/locais (não colidem com os apelidos reservados acima)
const FALLBACK_NICKNAMES = ['Mojica', 'Pintado', 'Pacu', 'Pequi', 'Tuiuiú', 'Arara', 'Guaraná', 'Pantanal'];

const FEMALE = /francisca|thalita|luciana|joana|vit[oó]ria|leila|yara|fernanda|brenda|elza|giovanna|let[ií]cia|manuela|camila|maria|helia|google/i;
const MALE = /antonio|felipe|donato|f[aá]bio|humberto|j[uú]lio|nicolau|val[eé]rio|macerio|daniel/i;

// Vozes escondidas quando há opções melhores: Portugal e antigas/robóticas (Maria/Daniel do Windows)
function isHiddenVoice(v: Speech.Voice): boolean {
  const lang = v.language.replace('_', '-').toLowerCase();
  if (!lang.startsWith('pt-br')) return true;
  return /\bmaria\b|\bdaniel\b|compact|espeak/i.test(`${v.name} ${v.identifier}`);
}

let voicesPromise: Promise<PtVoice[]> | null = null;
const voiceSubscribers = new Set<() => void>();

function notifyVoiceSubscribers() {
  voiceSubscribers.forEach((cb) => cb());
}

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([promise, new Promise<T>((r) => setTimeout(() => r(fallback), ms))]);
}

function mapRawVoices(voices: Speech.Voice[]): PtVoice[] {
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

  return named.map(({ v, natural, nickname, gender }) => {
    const nick = nickname ?? FALLBACK_NICKNAMES.find((n) => !used.has(n)) ?? `Voz ${used.size + 1}`;
    used.add(nick);
    return { id: v.identifier, label: nick, gender, natural };
  });
}

function readWebVoicesSync(): Speech.Voice[] {
  if (Platform.OS !== 'web' || !hasSpeechSupport()) return [];
  try {
    return window.speechSynthesis.getVoices().map((v) => ({
      identifier: v.voiceURI,
      name: v.name,
      language: v.lang,
      quality: Speech.VoiceQuality.Default,
    }));
  } catch {
    return [];
  }
}

/** Vozes em português do aparelho, da mais natural para a menos natural. */
export function getPortugueseVoices(forceRefresh = false): Promise<PtVoice[]> {
  if (!hasSpeechSupport()) return Promise.resolve([]);
  if (forceRefresh) voicesPromise = null;

  if (!voicesPromise) {
    // Na web, se as vozes já estiverem prontas sincronamente, mapeia imediatamente
    const syncWeb = readWebVoicesSync();
    if (syncWeb.length > 0) {
      voicesPromise = Promise.resolve(mapRawVoices(syncWeb));
      return voicesPromise;
    }

    voicesPromise = withTimeout(Speech.getAvailableVoicesAsync(), 2500, [])
      .then((voices) => {
        const list = mapRawVoices(voices);
        if (!list.length) {
          // Cache curto (3s) enquanto o navegador ainda carrega vozes; `voiceschanged`
          // também invalida imediatamente assim que chegarem.
          setTimeout(() => {
            voicesPromise = null;
          }, 3000);
        }
        return list;
      })
      .catch(() => {
        setTimeout(() => {
          voicesPromise = null;
        }, 3000);
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

/** Lista de vozes + situação ('checking' | 'ok' | 'missing'), atualizada reativamente na web. */
export function usePortugueseVoices() {
  const [state, setState] = useState<{ status: 'checking' | 'ok' | 'missing'; voices: PtVoice[] }>({
    status: 'checking',
    voices: [],
  });

  useEffect(() => {
    let alive = true;
    const load = (force = false) => {
      getPortugueseVoices(force).then((voices) => {
        if (alive) setState({ status: voices.length ? 'ok' : 'missing', voices });
      });
    };

    load(false);
    const onVoicesReady = () => load(true);
    voiceSubscribers.add(onVoicesReady);

    return () => {
      alive = false;
      voiceSubscribers.delete(onVoicesReady);
    };
  }, []);

  return state;
}

/** Compatibilidade: só a situação. */
export function usePortugueseVoiceStatus() {
  return usePortugueseVoices().status;
}

// ── Normalização de texto para leitura natural em pt-BR ────
export function normalizeForSpeech(text: string): string {
  return text
    .replace(/\b2FA\b/g, 'autenticação em duas etapas')
    .replace(/\bArt\.\s*(\d+)/gi, 'Artigo $1')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Divide o texto em pedaços curtos (frases) sem quebrar números nem URLs ─
export function splitIntoChunks(text: string, max = 180): string[] {
  const clean = normalizeForSpeech(text);
  if (!clean) return [];
  // Só quebra frase quando pontuação (. ! ? …) é seguida de espaço ou fim do texto.
  // Preserva intactos valores como "R$ 1.500" e domínios como "loja-ofertas.xyz".
  const sentences = clean.match(/(?:[^.!?…]+|[.!?…](?!["”']?(?:\s|$)))+[.!?…]*["”']?\s*/g) ?? [clean];
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

// ── Navegador: escuta voiceschanged + destrava voz no 1º toque/tecla ─
if (Platform.OS === 'web' && hasSpeechSupport()) {
  try {
    window.speechSynthesis.addEventListener?.('voiceschanged', () => {
      if (window.speechSynthesis.getVoices().length > 0) {
        voicesPromise = null;
        notifyVoiceSubscribers();
      }
    });
  } catch {
    /* fallback silencioso */
  }

  const unlock = () => {
    try {
      const u = new SpeechSynthesisUtterance(' ');
      u.volume = 0;
      window.speechSynthesis.speak(u);
      if (window.speechSynthesis.getVoices().length > 0) {
        voicesPromise = null;
        notifyVoiceSubscribers();
      }
    } catch {
      /* navegador sem suporte: o botão Ouvir simplesmente não fala */
    }
    window.removeEventListener('pointerdown', unlock, true);
    window.removeEventListener('keydown', unlock, true);
  };
  window.addEventListener('pointerdown', unlock, true);
  window.addEventListener('keydown', unlock, true);
}

// ── Funções de falar / parar (globais e seguras) ───────────
export function stopSpeech() {
  currentRun++;
  try {
    if (hasSpeechSupport()) Speech.stop();
  } catch {
    /* ignora se motor de voz não disponível */
  }
  useSpeechStatus.setState({ speakingText: null });
}

async function startSpeaking(text: string, rate: number, voiceId?: string | null) {
  if (!text?.trim() || !hasSpeechSupport()) return;
  const run = ++currentRun;
  try {
    Speech.stop();
  } catch {
    /* ignora */
  }
  useSpeechStatus.setState({ speakingText: text });

  const voice = await getPortugueseVoice(voiceId);
  // Chrome às vezes ignora ou pausa uma fala pedida logo depois de cancelar a anterior
  if (Platform.OS === 'web') {
    await new Promise((r) => setTimeout(r, 60));
    try {
      window.speechSynthesis.resume();
    } catch {
      /* ignora */
    }
  }
  if (run !== currentRun) return; // outra fala começou (ou parou) enquanto esperávamos

  const finish = () => {
    if (run === currentRun) useSpeechStatus.setState({ speakingText: null });
  };

  const chunks = splitIntoChunks(text);
  if (!chunks.length) {
    finish();
    return;
  }

  try {
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
  } catch {
    finish();
  }
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
      if (text && useSpeechStatus.getState().speakingText === text) stopSpeech();
    },
    [text]
  );

  return {
    speak,
    stop: stopSpeech,
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
    if (!autoRead || !text?.trim()) return;
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
