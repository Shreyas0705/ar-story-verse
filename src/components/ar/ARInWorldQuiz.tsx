import { useEffect, useRef, useCallback } from "react";
import { QuizQuestion, StoryQuiz } from "@/data/quizData";

interface ARInWorldQuizProps {
  quiz: StoryQuiz;
  isOpen: boolean;
  onClose: () => void;
  language: string;
  onPlaySound?: (correct: boolean) => void;
}

/**
 * Spawns A-Frame entities inside the scene for an in-world quiz panel.
 * Uses dwell-select + billboard components registered in aframe-components.ts
 */
const ARInWorldQuiz = ({ quiz, isOpen, onClose, language, onPlaySound }: ARInWorldQuizProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentQ = useRef(0);
  const score = useRef(0);
  const entityRef = useRef<any>(null);

  const cleanupEntities = useCallback(() => {
    if (entityRef.current?.parentNode) {
      entityRef.current.parentNode.removeChild(entityRef.current);
    }
    entityRef.current = null;
  }, []);

  const renderQuestion = useCallback((qIndex: number) => {
    const AFRAME = (window as any).AFRAME;
    if (!AFRAME) return;

    cleanupEntities();

    const scene = document.querySelector("a-scene");
    if (!scene) return;

    const question = quiz.questions[qIndex];
    if (!question) {
      // Quiz complete – show results
      renderResults();
      return;
    }

    const qText = language === "hi" ? question.questionHi : question.question;

    // Container entity – positioned in front of camera
    const container = document.createElement("a-entity");
    container.setAttribute("position", "0 1.8 -2.5");
    container.setAttribute("billboard", "");
    container.setAttribute("id", "ar-quiz-panel");

    // Background panel
    const bg = document.createElement("a-plane");
    bg.setAttribute("width", "2.4");
    bg.setAttribute("height", "1.8");
    bg.setAttribute("color", "#1a1a2e");
    bg.setAttribute("material", "opacity: 0.85; shader: flat");
    bg.setAttribute("fade-in", "");
    container.appendChild(bg);

    // Border glow
    const border = document.createElement("a-plane");
    border.setAttribute("width", "2.5");
    border.setAttribute("height", "1.9");
    border.setAttribute("color", "#a855f7");
    border.setAttribute("material", "opacity: 0.3; shader: flat");
    border.setAttribute("position", "0 0 -0.01");
    container.appendChild(border);

    // Progress text
    const progress = document.createElement("a-text");
    progress.setAttribute("value", `${qIndex + 1}/${quiz.questions.length}`);
    progress.setAttribute("align", "right");
    progress.setAttribute("position", "1.0 0.75 0.02");
    progress.setAttribute("scale", "0.4 0.4 0.4");
    progress.setAttribute("color", "#a855f7");
    container.appendChild(progress);

    // Type badge
    const typeLabel = question.type === "multiple-choice"
      ? (language === "hi" ? "बहुविकल्पी" : "Multiple Choice")
      : question.type === "comprehension"
        ? (language === "hi" ? "समझ" : "Comprehension")
        : (language === "hi" ? "शब्दावली" : "Vocabulary");

    const badge = document.createElement("a-text");
    badge.setAttribute("value", typeLabel);
    badge.setAttribute("align", "left");
    badge.setAttribute("position", "-1.0 0.75 0.02");
    badge.setAttribute("scale", "0.35 0.35 0.35");
    badge.setAttribute("color", "#06b6d4");
    container.appendChild(badge);

    // Question text
    const qTextEl = document.createElement("a-text");
    qTextEl.setAttribute("value", wrapText(qText, 40));
    qTextEl.setAttribute("align", "center");
    qTextEl.setAttribute("position", "0 0.45 0.02");
    qTextEl.setAttribute("scale", "0.5 0.5 0.5");
    qTextEl.setAttribute("color", "#ffffff");
    qTextEl.setAttribute("width", "2.2");
    container.appendChild(qTextEl);

    // Answer options
    question.options.forEach((option, idx) => {
      const text = language === "hi" ? option.textHi : option.text;
      const yPos = 0.1 - idx * 0.25;

      // Option button background
      const optBg = document.createElement("a-plane");
      optBg.setAttribute("width", "2.0");
      optBg.setAttribute("height", "0.2");
      optBg.setAttribute("position", `0 ${yPos} 0.02`);
      optBg.setAttribute("color", "#2a2a4e");
      optBg.setAttribute("material", "opacity: 0.6; shader: flat");
      optBg.setAttribute("class", "clickable");
      optBg.setAttribute("dwell-select", "duration: 1500");

      // Option label
      const label = String.fromCharCode(65 + idx);
      const optText = document.createElement("a-text");
      optText.setAttribute("value", `${label}. ${text}`);
      optText.setAttribute("align", "left");
      optText.setAttribute("position", "-0.9 0 0.01");
      optText.setAttribute("scale", "0.4 0.4 0.4");
      optText.setAttribute("color", "#e0e0e0");
      optBg.appendChild(optText);

      // Dwell-activated handler
      optBg.addEventListener("dwell-activated", () => {
        handleAnswer(question, option.isCorrect, container, yPos, idx);
      });
      // Also handle regular click
      optBg.addEventListener("click", () => {
        handleAnswer(question, option.isCorrect, container, yPos, idx);
      });

      container.appendChild(optBg);
    });

    // Close button
    const closeBtn = document.createElement("a-plane");
    closeBtn.setAttribute("width", "0.2");
    closeBtn.setAttribute("height", "0.2");
    closeBtn.setAttribute("position", "1.15 0.8 0.02");
    closeBtn.setAttribute("color", "#ef4444");
    closeBtn.setAttribute("material", "opacity: 0.7; shader: flat");
    closeBtn.setAttribute("class", "clickable");
    closeBtn.setAttribute("dwell-select", "duration: 1200");

    const closeText = document.createElement("a-text");
    closeText.setAttribute("value", "X");
    closeText.setAttribute("align", "center");
    closeText.setAttribute("position", "0 0 0.01");
    closeText.setAttribute("scale", "0.4 0.4 0.4");
    closeText.setAttribute("color", "#ffffff");
    closeBtn.appendChild(closeText);
    closeBtn.addEventListener("dwell-activated", () => { cleanupEntities(); onClose(); });
    closeBtn.addEventListener("click", () => { cleanupEntities(); onClose(); });
    container.appendChild(closeBtn);

    scene.appendChild(container);
    entityRef.current = container;
  }, [quiz, language, cleanupEntities, onClose]);

  const handleAnswer = useCallback((question: QuizQuestion, isCorrect: boolean, container: any, yPos: number, idx: number) => {
    // Visual feedback
    const options = container.querySelectorAll(".clickable[dwell-select]");
    options.forEach((opt: any, i: number) => {
      const correct = question.options[i]?.isCorrect;
      if (correct) {
        opt.setAttribute("color", "#22c55e");
        opt.setAttribute("material", "opacity: 0.8");
      } else if (i === idx && !isCorrect) {
        opt.setAttribute("color", "#ef4444");
        opt.setAttribute("material", "opacity: 0.8");
      }
      // Disable further selection
      opt.removeAttribute("dwell-select");
    });

    if (isCorrect) {
      score.current += 1;
    }

    onPlaySound?.(isCorrect);

    // Show explanation
    const explanation = language === "hi" ? question.explanationHi : question.explanation;
    const expText = document.createElement("a-text");
    expText.setAttribute("value", wrapText(explanation, 50));
    expText.setAttribute("align", "center");
    expText.setAttribute("position", "0 -0.85 0.02");
    expText.setAttribute("scale", "0.3 0.3 0.3");
    expText.setAttribute("color", isCorrect ? "#22c55e" : "#ef4444");
    expText.setAttribute("width", "2.0");
    container.appendChild(expText);

    // Auto-advance after delay
    setTimeout(() => {
      currentQ.current += 1;
      renderQuestion(currentQ.current);
    }, 2500);
  }, [language, onPlaySound, renderQuestion]);

  const renderResults = useCallback(() => {
    cleanupEntities();
    const scene = document.querySelector("a-scene");
    if (!scene) return;

    const container = document.createElement("a-entity");
    container.setAttribute("position", "0 1.8 -2.5");
    container.setAttribute("billboard", "");

    const bg = document.createElement("a-plane");
    bg.setAttribute("width", "2.0");
    bg.setAttribute("height", "1.2");
    bg.setAttribute("color", "#1a1a2e");
    bg.setAttribute("material", "opacity: 0.85; shader: flat");
    bg.setAttribute("fade-in", "");
    container.appendChild(bg);

    const pct = (score.current / quiz.questions.length) * 100;
    const emoji = pct === 100 ? "🏆" : pct >= 80 ? "🌟" : pct >= 60 ? "👍" : "📚";
    const msg = pct === 100
      ? (language === "hi" ? "शानदार!" : "Perfect!")
      : pct >= 80
        ? (language === "hi" ? "बहुत अच्छा!" : "Excellent!")
        : pct >= 60
          ? (language === "hi" ? "अच्छा!" : "Good job!")
          : (language === "hi" ? "फिर से कोशिश करें!" : "Try again!");

    const scoreText = document.createElement("a-text");
    scoreText.setAttribute("value", `${emoji} ${score.current}/${quiz.questions.length}`);
    scoreText.setAttribute("align", "center");
    scoreText.setAttribute("position", "0 0.3 0.02");
    scoreText.setAttribute("scale", "0.7 0.7 0.7");
    scoreText.setAttribute("color", "#a855f7");
    container.appendChild(scoreText);

    const msgText = document.createElement("a-text");
    msgText.setAttribute("value", msg);
    msgText.setAttribute("align", "center");
    msgText.setAttribute("position", "0 0.05 0.02");
    msgText.setAttribute("scale", "0.5 0.5 0.5");
    msgText.setAttribute("color", "#ffffff");
    container.appendChild(msgText);

    // Retry button
    const retryBtn = document.createElement("a-plane");
    retryBtn.setAttribute("width", "0.8");
    retryBtn.setAttribute("height", "0.22");
    retryBtn.setAttribute("position", "-0.5 -0.25 0.02");
    retryBtn.setAttribute("color", "#2a2a4e");
    retryBtn.setAttribute("material", "opacity: 0.7; shader: flat");
    retryBtn.setAttribute("class", "clickable");
    retryBtn.setAttribute("dwell-select", "duration: 1500");
    const retryText = document.createElement("a-text");
    retryText.setAttribute("value", language === "hi" ? "फिर से" : "Retry");
    retryText.setAttribute("align", "center");
    retryText.setAttribute("position", "0 0 0.01");
    retryText.setAttribute("scale", "0.35 0.35 0.35");
    retryText.setAttribute("color", "#ffffff");
    retryBtn.appendChild(retryText);
    retryBtn.addEventListener("dwell-activated", () => {
      currentQ.current = 0;
      score.current = 0;
      renderQuestion(0);
    });
    retryBtn.addEventListener("click", () => {
      currentQ.current = 0;
      score.current = 0;
      renderQuestion(0);
    });
    container.appendChild(retryBtn);

    // Done button
    const doneBtn = document.createElement("a-plane");
    doneBtn.setAttribute("width", "0.8");
    doneBtn.setAttribute("height", "0.22");
    doneBtn.setAttribute("position", "0.5 -0.25 0.02");
    doneBtn.setAttribute("color", "#a855f7");
    doneBtn.setAttribute("material", "opacity: 0.7; shader: flat");
    doneBtn.setAttribute("class", "clickable");
    doneBtn.setAttribute("dwell-select", "duration: 1200");
    const doneText = document.createElement("a-text");
    doneText.setAttribute("value", language === "hi" ? "बंद करें" : "Done");
    doneText.setAttribute("align", "center");
    doneText.setAttribute("position", "0 0 0.01");
    doneText.setAttribute("scale", "0.35 0.35 0.35");
    doneText.setAttribute("color", "#ffffff");
    doneBtn.appendChild(doneText);
    doneBtn.addEventListener("dwell-activated", () => { cleanupEntities(); onClose(); });
    doneBtn.addEventListener("click", () => { cleanupEntities(); onClose(); });
    container.appendChild(doneBtn);

    scene.appendChild(container);
    entityRef.current = container;
  }, [quiz, language, cleanupEntities, onClose, renderQuestion]);

  useEffect(() => {
    if (isOpen) {
      currentQ.current = 0;
      score.current = 0;
      // Small delay to ensure scene is ready
      setTimeout(() => renderQuestion(0), 300);
    } else {
      cleanupEntities();
    }
    return () => cleanupEntities();
  }, [isOpen, renderQuestion, cleanupEntities]);

  return null; // No DOM — everything is injected into A-Frame scene
};

function wrapText(text: string, maxChars: number): string {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > maxChars) {
      lines.push(current.trim());
      current = word;
    } else {
      current += " " + word;
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines.join("\n");
}

export default ARInWorldQuiz;
