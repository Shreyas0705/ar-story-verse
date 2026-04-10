import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { StoryQuiz, QuizQuestion } from "@/data/quizData";
import { CheckCircle, XCircle, Trophy, RotateCcw, ChevronRight, X, Brain, BookOpen, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ARQuizOverlayProps {
  quiz: StoryQuiz;
  isOpen: boolean;
  onClose: () => void;
}

const ARQuizOverlay = ({ quiz, isOpen, onClose }: ARQuizOverlayProps) => {
  const { t, language } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  useEffect(() => {
    if (isOpen) {
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setScore(0);
      setAnsweredQuestions(new Set());
      setQuizCompleted(false);
    }
  }, [isOpen]);

  const getTypeIcon = (type: QuizQuestion["type"]) => {
    switch (type) {
      case "multiple-choice": return <Brain className="w-4 h-4" />;
      case "comprehension": return <BookOpen className="w-4 h-4" />;
      case "vocabulary": return <Sparkles className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: QuizQuestion["type"]) => {
    switch (type) {
      case "multiple-choice": return language === "hi" ? "बहुविकल्पी" : "Multiple Choice";
      case "comprehension": return language === "hi" ? "समझ" : "Comprehension";
      case "vocabulary": return language === "hi" ? "शब्दावली" : "Vocabulary";
    }
  };

  const handleSelectOption = (optionText: string) => {
    if (showFeedback) return;
    setSelectedAnswer(optionText);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    const selectedOption = currentQuestion.options.find(
      (o) => (language === "hi" ? o.textHi : o.text) === selectedAnswer
    );
    const correct = selectedOption?.isCorrect ?? false;
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct && !answeredQuestions.has(currentQuestion.id)) {
      setScore((prev) => prev + 1);
    }
    setAnsweredQuestions((prev) => new Set([...prev, currentQuestion.id]));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setAnsweredQuestions(new Set());
    setQuizCompleted(false);
  };

  const getScoreEmoji = () => {
    const pct = (score / quiz.questions.length) * 100;
    if (pct === 100) return "🏆";
    if (pct >= 80) return "🌟";
    if (pct >= 60) return "👍";
    if (pct >= 40) return "📚";
    return "💪";
  };

  const getScoreMessage = () => {
    const pct = (score / quiz.questions.length) * 100;
    if (pct === 100) return language === "hi" ? "शानदार! सभी सही!" : "Perfect! All correct!";
    if (pct >= 80) return language === "hi" ? "बहुत अच्छा!" : "Excellent work!";
    if (pct >= 60) return language === "hi" ? "अच्छा प्रयास!" : "Good job!";
    if (pct >= 40) return language === "hi" ? "और अभ्यास करें!" : "Keep practicing!";
    return language === "hi" ? "फिर से कोशिश करें!" : "Try again!";
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      {/* Semi-transparent AR backdrop */}
      <div className="relative w-[90%] max-w-lg pointer-events-auto">
        {/* Glowing AR card */}
        <div className="relative rounded-2xl border border-primary/40 bg-card/85 backdrop-blur-xl shadow-[0_0_40px_hsl(var(--primary)/0.25)] overflow-hidden">
          {/* Progress bar */}
          {!quizCompleted && (
            <div className="h-1 bg-muted">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="font-bold text-sm">
                {language === "hi" ? "AR प्रश्नोत्तरी" : "AR Quiz"}
              </span>
              {!quizCompleted && (
                <span className="text-xs text-muted-foreground ml-1">
                  {currentQuestionIndex + 1}/{quiz.questions.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!quizCompleted && (
                <span className="text-xs font-medium text-primary">
                  {score}/{answeredQuestions.size}
                </span>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-muted transition-colors"
                data-gaze
                data-gaze-label="Close"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3">
            {quizCompleted ? (
              /* Results */
              <div className="text-center space-y-4 py-4">
                <div className="text-5xl">{getScoreEmoji()}</div>
                <div>
                  <p className="text-2xl font-bold">{score}/{quiz.questions.length}</p>
                  <p className="text-muted-foreground text-sm">{getScoreMessage()}</p>
                </div>
                <div className="flex gap-3 justify-center pt-2">
                  <button
                    onClick={handleRestart}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-muted/50 hover:bg-muted text-sm font-medium transition-colors"
                    data-gaze
                    data-gaze-label={language === "hi" ? "फिर से" : "Retry"}
                  >
                    <RotateCcw className="w-4 h-4" />
                    {language === "hi" ? "फिर से" : "Retry"}
                  </button>
                  <button
                    onClick={onClose}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-medium transition-colors"
                    data-gaze
                    data-gaze-label={language === "hi" ? "बंद करें" : "Done"}
                  >
                    {language === "hi" ? "बंद करें" : "Done"}
                  </button>
                </div>
              </div>
            ) : (
              /* Question */
              <>
                {/* Type badge */}
                <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                  {getTypeIcon(currentQuestion.type)}
                  {getTypeLabel(currentQuestion.type)}
                </div>

                {/* Question text */}
                <p className="font-semibold text-sm leading-relaxed">
                  {language === "hi" ? currentQuestion.questionHi : currentQuestion.question}
                </p>

                {/* Answer options — gaze selectable */}
                <div className="space-y-2">
                  {currentQuestion.options.map((option, idx) => {
                    const text = language === "hi" ? option.textHi : option.text;
                    const isSelected = selectedAnswer === text;
                    const showCorrect = showFeedback && option.isCorrect;
                    const showWrong = showFeedback && isSelected && !option.isCorrect;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(text)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 text-left text-sm font-medium transition-all",
                          !showFeedback && isSelected && "border-primary bg-primary/10",
                          !showFeedback && !isSelected && "border-border/60 hover:border-primary/50 bg-card/50",
                          showCorrect && "border-green-500 bg-green-500/15",
                          showWrong && "border-destructive bg-destructive/15"
                        )}
                        data-gaze
                        data-gaze-label={`Option ${idx + 1}`}
                        disabled={showFeedback}
                      >
                        <span className="flex items-center justify-center w-6 h-6 rounded-full border border-current text-xs shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{text}</span>
                        {showCorrect && <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
                        {showWrong && <XCircle className="w-4 h-4 text-destructive shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback */}
                {showFeedback && (
                  <div className={cn(
                    "flex items-start gap-2 p-3 rounded-xl text-xs",
                    isCorrect ? "bg-green-500/10 border border-green-500/20" : "bg-destructive/10 border border-destructive/20"
                  )}>
                    {isCorrect ? <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> : <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />}
                    <p className="text-muted-foreground">
                      {language === "hi" ? currentQuestion.explanationHi : currentQuestion.explanation}
                    </p>
                  </div>
                )}

                {/* Action button */}
                <div className="flex justify-end pt-1">
                  {!showFeedback ? (
                    <button
                      onClick={handleSubmit}
                      disabled={!selectedAnswer}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                        selectedAnswer
                          ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      )}
                      data-gaze
                      data-gaze-label={language === "hi" ? "जमा करें" : "Submit"}
                    >
                      {language === "hi" ? "जमा करें" : "Submit"}
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-medium transition-all"
                      data-gaze
                      data-gaze-label={language === "hi" ? "अगला" : "Next"}
                    >
                      {currentQuestionIndex < quiz.questions.length - 1 ? (
                        <>
                          {language === "hi" ? "अगला" : "Next"}
                          <ChevronRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>{language === "hi" ? "परिणाम" : "Results"}</>
                      )}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARQuizOverlay;
