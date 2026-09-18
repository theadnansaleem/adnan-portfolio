"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

interface MusicPlayerCtx {
  playing: boolean;
  volume: number;
  ready: boolean;
  /** true = queued; starts on the next user interaction */
  pending: boolean;
  toggle: () => void;
  /** Called by Hero when the video becomes playable; queues playback for the first gesture */
  triggerPlay: () => void;
  changeVolume: (v: number) => void;
}

const Ctx = createContext<MusicPlayerCtx | null>(null);

export const useMusicPlayer = (): MusicPlayerCtx => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMusicPlayer must be used within MusicPlayerProvider");
  return ctx;
};

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pausedByVisibility = useRef(false);
  const manuallyPaused = useRef(false);
  const [playing, setPlaying]   = useState(false);
  const [volume,  setVolume]    = useState(0.35);
  const [ready,   setReady]     = useState(false);
  const [pending, setPending]   = useState(false);

  /* Init audio once. Layout effect so it exists before Hero's mount effect calls triggerPlay */
  useLayoutEffect(() => {
    const audio = new Audio("/audio/ambient.mp3");
    audio.loop    = true;
    audio.volume  = 0.35;
    // No request until the first play: PageSpeed fetches "metadata" as the whole file and bills it to LCP
    audio.preload = "none";
    audio.addEventListener("canplaythrough", () => setReady(true));
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  /* Start on the very first user gesture */
  useEffect(() => {
    if (!pending) return;

    const start = async () => {
      const audio = audioRef.current;
      if (!audio) return;
      try {
        await audio.play();
        setPlaying(true);
        setPending(false);
        manuallyPaused.current = false;
      } catch {/* still blocked — user will click the button manually */}
    };

    window.addEventListener("pointerdown", start, { once: true });
    // A touch tap only counts as a user gesture on release, so pointerdown alone never starts audio on phones
    window.addEventListener("pointerup",   start, { once: true });
    window.addEventListener("scroll",      start, { once: true, passive: true });
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("pointerup",   start);
      window.removeEventListener("scroll",      start);
    };
  }, [pending]);

  /* Called by Hero once its video is playable. No autoplay attempt: where a browser allows it,
     the whole track downloads during first paint, so playback waits for the first gesture. */
  const triggerPlay = useCallback(() => {
    if (!playing) setPending(true);
  }, [playing]);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      setPending(false);
      manuallyPaused.current = true;
    } else {
      try {
        await audio.play();
        setPlaying(true);
        manuallyPaused.current = false;
      } catch {
        setPending(true);
      }
    }
  }, [playing]);

  const changeVolume = useCallback((v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  /* Pause when tab is hidden, resume when it becomes visible again */
  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.visibilityState === 'hidden') {
        if (!audio.paused && !manuallyPaused.current) {
          audio.pause();
          pausedByVisibility.current = true;
        }
      } else {
        if (pausedByVisibility.current && !manuallyPaused.current) {
          audio.play().catch(() => {});
          pausedByVisibility.current = false;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <Ctx.Provider value={{ playing, volume, ready, pending, toggle, triggerPlay, changeVolume }}>
      {children}
    </Ctx.Provider>
  );
}
