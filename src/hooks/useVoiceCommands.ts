import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";

interface VoiceCommandHandlers {
  onPlay?: () => void;
  onPause?: () => void;
  onRestart?: () => void;
  onMute?: () => void;
  onUnmute?: () => void;
}

interface UseVoiceCommandsReturn {
  isListening: boolean;
  isSupported: boolean;
  lastCommand: string | null;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
}

const COMMANDS_EN: Record<string, string> = {
  play: "play",
  start: "play",
  resume: "play",
  pause: "pause",
  paws: "pause",
  stop: "pause",
  restart: "restart",
  "start over": "restart",
  "play again": "restart",
  mute: "mute",
  unmute: "unmute",
  "un mute": "unmute",
  "sound on": "unmute",
  "sound off": "mute",
};

const COMMANDS_HI: Record<string, string> = {
  "चलाओ": "play",
  "शुरू": "play",
  "रोको": "pause",
  "बंद": "pause",
  "फिर से": "restart",
  "दोबारा": "restart",
  "आवाज़ बंद": "mute",
  "आवाज़ चालू": "unmute",
};

const HINDI_CHAR_REGEX = /[\u0900-\u097F]/;

const normalizeTranscript = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/g, " ")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const escapeForRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function useVoiceCommands(
  handlers: VoiceCommandHandlers,
  language: string = "en"
): UseVoiceCommandsReturn {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const lastCommandTimeoutRef = useRef<number | null>(null);
  const isSupported = typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  const processTranscript = useCallback((transcript: string) => {
    const normalizedTranscript = normalizeTranscript(transcript);
    const commands = language === "hi" ? { ...COMMANDS_HI, ...COMMANDS_EN } : COMMANDS_EN;
    const sortedCommands = Object.entries(commands).sort(([firstPhrase], [secondPhrase]) => secondPhrase.length - firstPhrase.length);

    for (const [phrase, action] of sortedCommands) {
      const normalizedPhrase = normalizeTranscript(phrase);
      const isHindiPhrase = HINDI_CHAR_REGEX.test(normalizedPhrase);
      const hasMatch = isHindiPhrase
        ? normalizedTranscript.includes(normalizedPhrase)
        : new RegExp(`(^|\\s)${escapeForRegex(normalizedPhrase)}(?=\\s|$)`).test(normalizedTranscript);

      if (hasMatch) {
        setLastCommand(phrase);
        switch (action) {
          case "play": handlersRef.current.onPlay?.(); break;
          case "pause": handlersRef.current.onPause?.(); break;
          case "restart": handlersRef.current.onRestart?.(); break;
          case "mute": handlersRef.current.onMute?.(); break;
          case "unmute": handlersRef.current.onUnmute?.(); break;
        }

        if (lastCommandTimeoutRef.current) {
          window.clearTimeout(lastCommandTimeoutRef.current);
        }

        lastCommandTimeoutRef.current = window.setTimeout(() => {
          setLastCommand(null);
          lastCommandTimeoutRef.current = null;
        }, 2000);

        return;
      }
    }
  }, [language]);

  const startListening = useCallback(() => {
    if (!isSupported || recognitionRef.current) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = language === "hi" ? "hi-IN" : "en-US";

    recognition.onresult = (event: any) => {
      const last = event.results[event.results.length - 1];
      if (last.isFinal) {
        processTranscript(last[0].transcript);
      }
    };

    recognition.onend = () => {
      // Auto-restart if still supposed to be listening
      if (recognitionRef.current) {
        try { recognition.start(); } catch {}
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === "not-allowed") {
        setIsListening(false);
        recognitionRef.current = null;
        toast.error("🎤 Microphone permission denied. Please allow mic access.");
      } else if (event.error !== "no-speech") {
        toast.error("🎤 Voice recognition error: " + event.error);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    toast.success("🎤 Voice commands active — say Play, Pause, Restart, Mute, or Unmute");
    setIsListening(true);
  }, [isSupported, language, processTranscript]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      const ref = recognitionRef.current;
      recognitionRef.current = null;
      ref.stop();
      setIsListening(false);
      toast.info("🎤 Voice commands stopped");
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  useEffect(() => {
    return () => {
      if (lastCommandTimeoutRef.current) {
        window.clearTimeout(lastCommandTimeoutRef.current);
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  return { isListening, isSupported, lastCommand, startListening, stopListening, toggleListening };
}
