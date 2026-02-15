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
  stop: "pause",
  restart: "restart",
  "start over": "restart",
  "play again": "restart",
  mute: "mute",
  unmute: "unmute",
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

export function useVoiceCommands(
  handlers: VoiceCommandHandlers,
  language: string = "en"
): UseVoiceCommandsReturn {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const isSupported = typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  const processTranscript = useCallback((transcript: string) => {
    const lower = transcript.toLowerCase().trim();
    const commands = language === "hi" ? { ...COMMANDS_HI, ...COMMANDS_EN } : COMMANDS_EN;

    for (const [phrase, action] of Object.entries(commands)) {
      if (lower.includes(phrase)) {
        setLastCommand(phrase);
        switch (action) {
          case "play": handlersRef.current.onPlay?.(); break;
          case "pause": handlersRef.current.onPause?.(); break;
          case "restart": handlersRef.current.onRestart?.(); break;
          case "mute": handlersRef.current.onMute?.(); break;
          case "unmute": handlersRef.current.onUnmute?.(); break;
        }
        // Clear last command after 2s
        setTimeout(() => setLastCommand(null), 2000);
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
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  return { isListening, isSupported, lastCommand, startListening, stopListening, toggleListening };
}
