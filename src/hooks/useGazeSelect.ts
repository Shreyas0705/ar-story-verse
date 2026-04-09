import { useState, useEffect, useRef, useCallback } from "react";

interface GazeState {
  enabled: boolean;
  toggle: () => void;
  dwellProgress: number;          // 0–1
  gazeLabel: string | null;
  recenter: () => void;
  motionAvailable: boolean;
  motionDenied: boolean;
  requestMotion: () => void;
  reticleOffset: { x: number; y: number };
}

const DWELL_MS = 1200;
const POLL_MS = 80;
const MOTION_SENSITIVITY = 0.6;

export function useGazeSelect(): GazeState {
  const [enabled, setEnabled] = useState(false);
  const [dwellProgress, setDwellProgress] = useState(0);
  const [gazeLabel, setGazeLabel] = useState<string | null>(null);
  const [motionAvailable, setMotionAvailable] = useState(false);
  const [motionDenied, setMotionDenied] = useState(false);
  const [reticleOffset, setReticleOffset] = useState({ x: 0, y: 0 });

  const dwellTargetRef = useRef<Element | null>(null);
  const dwellStartRef = useRef<number>(0);
  const baseOrientation = useRef<{ beta: number; gamma: number } | null>(null);
  const rafRef = useRef<number>(0);

  const recenter = useCallback(() => {
    baseOrientation.current = null;
  }, []);

  const requestMotion = useCallback(async () => {
    const DM = DeviceMotionEvent as any;
    if (typeof DM.requestPermission === "function") {
      try {
        const perm = await DM.requestPermission();
        if (perm === "granted") {
          setMotionAvailable(true);
          setMotionDenied(false);
        } else {
          setMotionDenied(true);
        }
      } catch {
        setMotionDenied(true);
      }
    } else {
      setMotionAvailable(true);
    }
  }, []);

  // Fullscreen + orientation lock on enable
  useEffect(() => {
    if (!enabled) return;

    document.documentElement.requestFullscreen?.().catch(() => {});

    const sl = screen.orientation as any;
    sl?.lock?.("landscape")?.catch?.(() => {});

    return () => {
      document.exitFullscreen?.().catch(() => {});
      sl?.unlock?.();
    };
  }, [enabled]);

  // Device orientation → reticle offset
  useEffect(() => {
    if (!enabled || !motionAvailable) {
      setReticleOffset({ x: 0, y: 0 });
      return;
    }

    const handler = (e: DeviceOrientationEvent) => {
      const beta = e.beta ?? 0;
      const gamma = e.gamma ?? 0;

      if (!baseOrientation.current) {
        baseOrientation.current = { beta, gamma };
      }

      const dx = (gamma - baseOrientation.current.gamma) * MOTION_SENSITIVITY;
      const dy = (beta - baseOrientation.current.beta) * MOTION_SENSITIVITY;

      const maxX = window.innerWidth * 0.4;
      const maxY = window.innerHeight * 0.4;

      setReticleOffset({
        x: Math.max(-maxX, Math.min(maxX, dx * 4)),
        y: Math.max(-maxY, Math.min(maxY, dy * 4)),
      });
    };

    window.addEventListener("deviceorientation", handler);
    return () => window.removeEventListener("deviceorientation", handler);
  }, [enabled, motionAvailable]);

  // Gaze polling
  useEffect(() => {
    if (!enabled) {
      setDwellProgress(0);
      setGazeLabel(null);
      dwellTargetRef.current = null;
      return;
    }

    const poll = () => {
      const cx = window.innerWidth / 2 + reticleOffset.x;
      const cy = window.innerHeight / 2 + reticleOffset.y;

      const els = document.elementsFromPoint(cx, cy);
      const target = els.find((el) => el.hasAttribute("data-gaze"));

      if (target !== dwellTargetRef.current) {
        dwellTargetRef.current = target ?? null;
        dwellStartRef.current = target ? Date.now() : 0;
        setGazeLabel(target?.getAttribute("data-gaze-label") ?? null);
        setDwellProgress(0);
      } else if (target) {
        const elapsed = Date.now() - dwellStartRef.current;
        const progress = Math.min(1, elapsed / DWELL_MS);
        setDwellProgress(progress);

        if (progress >= 1) {
          (target as HTMLElement).click();
          dwellTargetRef.current = null;
          dwellStartRef.current = 0;
          setDwellProgress(0);
          setGazeLabel(null);
        }
      }
    };

    const id = setInterval(poll, POLL_MS);
    return () => clearInterval(id);
  }, [enabled, reticleOffset]);

  const toggle = useCallback(() => {
    setEnabled((v) => {
      if (!v) {
        // turning on — try motion
        requestMotion();
      }
      return !v;
    });
  }, [requestMotion]);

  return {
    enabled,
    toggle,
    dwellProgress,
    gazeLabel,
    recenter,
    motionAvailable,
    motionDenied,
    requestMotion,
    reticleOffset,
  };
}
