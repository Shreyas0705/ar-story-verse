import { useState, useEffect, useRef, useCallback } from "react";
import type { StoryScene } from "@/hooks/useStoryGeneration";

export function useStoryPlayer(scenes: StoryScene[], fullText: string) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const totalScenes = scenes.length;

  const stopNarration = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsNarrating(false);
  }, []);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const restart = useCallback(() => {
    setCurrentScene(0);
    setIsPlaying(true);
    stopNarration();
  }, [stopNarration]);

  const narrate = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    stopNarration();
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.onend = () => setIsNarrating(false);
    utteranceRef.current = utterance;
    setIsNarrating(true);
    window.speechSynthesis.speak(utterance);
  }, [fullText, stopNarration]);

  // Auto-advance scenes
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentScene((prev) => {
          if (prev >= totalScenes - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 5000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, totalScenes]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopNarration();
    };
  }, [stopNarration]);

  return {
    currentScene,
    setCurrentScene,
    isPlaying,
    isNarrating,
    play,
    pause,
    restart,
    narrate,
    stopNarration,
  };
}
