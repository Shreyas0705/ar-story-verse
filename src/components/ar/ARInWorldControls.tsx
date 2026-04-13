import { useEffect, useRef, useCallback } from "react";

interface ARInWorldControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
}

/**
 * Spawns floating A-Frame play/pause/restart controls inside the AR scene.
 * Uses dwell-select + billboard for gaze interaction.
 */
const ARInWorldControls = ({ isPlaying, onPlay, onPause, onRestart }: ARInWorldControlsProps) => {
  const entityRef = useRef<any>(null);

  const cleanup = useCallback(() => {
    if (entityRef.current?.parentNode) {
      entityRef.current.parentNode.removeChild(entityRef.current);
    }
    entityRef.current = null;
  }, []);

  const render = useCallback(() => {
    const AFRAME = (window as any).AFRAME;
    if (!AFRAME) return;

    cleanup();

    const scene = document.querySelector("a-scene");
    if (!scene) return;

    const container = document.createElement("a-entity");
    container.setAttribute("position", "-1.8 0.8 -2.5");
    container.setAttribute("billboard", "");
    container.setAttribute("id", "ar-controls-panel");

    // Semi-transparent background
    const bg = document.createElement("a-plane");
    bg.setAttribute("width", "0.8");
    bg.setAttribute("height", "1.0");
    bg.setAttribute("color", "#1a1a2e");
    bg.setAttribute("material", "opacity: 0.6; shader: flat");
    bg.setAttribute("fade-in", "");
    container.appendChild(bg);

    // Play/Pause button
    const ppBtn = document.createElement("a-plane");
    ppBtn.setAttribute("width", "0.5");
    ppBtn.setAttribute("height", "0.25");
    ppBtn.setAttribute("position", "0 0.25 0.02");
    ppBtn.setAttribute("color", isPlaying ? "#f59e0b" : "#22c55e");
    ppBtn.setAttribute("material", "opacity: 0.6; shader: flat");
    ppBtn.setAttribute("class", "clickable");
    ppBtn.setAttribute("dwell-select", "duration: 1500");

    const ppText = document.createElement("a-text");
    ppText.setAttribute("value", isPlaying ? "⏸ Pause" : "▶ Play");
    ppText.setAttribute("align", "center");
    ppText.setAttribute("position", "0 0 0.01");
    ppText.setAttribute("scale", "0.35 0.35 0.35");
    ppText.setAttribute("color", "#ffffff");
    ppBtn.appendChild(ppText);
    ppBtn.addEventListener("dwell-activated", () => isPlaying ? onPause() : onPlay());
    ppBtn.addEventListener("click", () => isPlaying ? onPause() : onPlay());
    container.appendChild(ppBtn);

    // Restart button
    const restartBtn = document.createElement("a-plane");
    restartBtn.setAttribute("width", "0.5");
    restartBtn.setAttribute("height", "0.25");
    restartBtn.setAttribute("position", "0 -0.1 0.02");
    restartBtn.setAttribute("color", "#3b82f6");
    restartBtn.setAttribute("material", "opacity: 0.6; shader: flat");
    restartBtn.setAttribute("class", "clickable");
    restartBtn.setAttribute("dwell-select", "duration: 1500");

    const restartText = document.createElement("a-text");
    restartText.setAttribute("value", "🔄 Restart");
    restartText.setAttribute("align", "center");
    restartText.setAttribute("position", "0 0 0.01");
    restartText.setAttribute("scale", "0.35 0.35 0.35");
    restartText.setAttribute("color", "#ffffff");
    restartBtn.appendChild(restartText);
    restartBtn.addEventListener("dwell-activated", onRestart);
    restartBtn.addEventListener("click", onRestart);
    container.appendChild(restartBtn);

    scene.appendChild(container);
    entityRef.current = container;
  }, [isPlaying, onPlay, onPause, onRestart, cleanup]);

  useEffect(() => {
    // Delay to ensure scene is ready
    const timer = setTimeout(render, 500);
    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, [render, cleanup]);

  return null;
};

export default ARInWorldControls;
