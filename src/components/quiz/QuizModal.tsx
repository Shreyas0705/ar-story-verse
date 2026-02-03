import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Trophy, 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  Brain, 
  Sparkles,
  ChevronRight,
  RotateCcw,
  X
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { StoryQuiz, QuizQuestion } from "@/data/quizData";
import { cn } from "@/lib/utils";

interface QuizModalProps {
  quiz: StoryQuiz;
  isOpen: boolean;
  onClose: () => void;
}

const QuizModal = ({ quiz, isOpen, onClose }: QuizModalProps) => {
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
      // Reset quiz state when opened
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setScore(0);
      setAnsweredQuestions(new Set());
      setQuizCompleted(false);
    }
  }, [isOpen]);

  const getQuestionTypeIcon = (type: QuizQuestion["type"]) => {
    switch (type) {
      case "multiple-choice":
        return <Brain className="w-5 h-5" />;
      case "comprehension":
        return <BookOpen className="w-5 h-5" />;
      case "vocabulary":
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getQuestionTypeLabel = (type: QuizQuestion["type"]) => {
    switch (type) {
      case "multiple-choice":
        return language === "hi" ? "बहुविकल्पी" : "Multiple Choice";
      case "comprehension":
        return language === "hi" ? "समझ" : "Comprehension";
      case "vocabulary":
        return language === "hi" ? "शब्दावली" : "Vocabulary";
    }
  };

  const handleAnswerSelect = (optionText: string) => {
    if (showFeedback) return;
    setSelectedAnswer(optionText);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const correctOption = currentQuestion.options.find((o) => o.isCorrect);
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

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setAnsweredQuestions(new Set());
    setQuizCompleted(false);
  };

  const getScoreEmoji = () => {
    const percentage = (score / quiz.questions.length) * 100;
    if (percentage === 100) return "🏆";
    if (percentage >= 80) return "🌟";
    if (percentage >= 60) return "👍";
    if (percentage >= 40) return "📚";
    return "💪";
  };

  const getScoreMessage = () => {
    const percentage = (score / quiz.questions.length) * 100;
    if (percentage === 100) {
      return language === "hi" ? "शानदार! सभी सही!" : "Perfect! All correct!";
    }
    if (percentage >= 80) {
      return language === "hi" ? "बहुत अच्छा!" : "Excellent work!";
    }
    if (percentage >= 60) {
      return language === "hi" ? "अच्छा प्रयास!" : "Good job!";
    }
    if (percentage >= 40) {
      return language === "hi" ? "और अभ्यास करें!" : "Keep practicing!";
    }
    return language === "hi" ? "फिर से कोशिश करें!" : "Try again!";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-border bg-card shadow-2xl">
        <CardHeader className="relative border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4"
          >
            <X className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-primary/10">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">
                {language === "hi" ? "कहानी प्रश्नोत्तरी" : "Story Quiz"}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{t(quiz.titleKey)}</p>
            </div>
          </div>

          {!quizCompleted && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {language === "hi" ? "प्रश्न" : "Question"} {currentQuestionIndex + 1} / {quiz.questions.length}
                </span>
                <span className="text-primary font-medium">
                  {language === "hi" ? "स्कोर" : "Score"}: {score}/{answeredQuestions.size}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardHeader>

        <CardContent className="p-6">
          {quizCompleted ? (
            // Results screen
            <div className="text-center space-y-6 py-8 animate-fade-in">
              <div className="text-6xl">{getScoreEmoji()}</div>
              
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {score} / {quiz.questions.length}
                </h2>
                <p className="text-xl text-muted-foreground">{getScoreMessage()}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 py-6">
                {quiz.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className={cn(
                      "p-3 rounded-xl flex flex-col items-center gap-1",
                      answeredQuestions.has(q.id) && 
                        quiz.questions.find(qq => qq.id === q.id)?.options.find(o => o.isCorrect)?.text === 
                        (language === "hi" ? q.options.find(o => o.isCorrect)?.textHi : q.options.find(o => o.isCorrect)?.text)
                        ? "bg-green-500/10"
                        : "bg-destructive/10"
                    )}
                  >
                    <span className="text-xs text-muted-foreground">
                      {getQuestionTypeLabel(q.type)}
                    </span>
                    {getQuestionTypeIcon(q.type)}
                  </div>
                ))}
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={handleRestartQuiz}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  {language === "hi" ? "फिर से खेलें" : "Play Again"}
                </Button>
                <Button
                  onClick={onClose}
                  className="gap-2 bg-gradient-to-r from-primary to-accent"
                >
                  {language === "hi" ? "पूर्ण" : "Done"}
                </Button>
              </div>
            </div>
          ) : (
            // Question screen
            <div className="space-y-6 animate-fade-in">
              {/* Question type badge */}
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-full bg-primary/10 flex items-center gap-2">
                  {getQuestionTypeIcon(currentQuestion.type)}
                  <span className="text-sm font-medium text-primary">
                    {getQuestionTypeLabel(currentQuestion.type)}
                  </span>
                </div>
              </div>

              {/* Question */}
              <h3 className="text-xl font-semibold leading-relaxed">
                {language === "hi" ? currentQuestion.questionHi : currentQuestion.question}
              </h3>

              {/* Options */}
              <RadioGroup
                value={selectedAnswer || ""}
                onValueChange={handleAnswerSelect}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, idx) => {
                  const optionText = language === "hi" ? option.textHi : option.text;
                  const isSelected = selectedAnswer === optionText;
                  const showCorrect = showFeedback && option.isCorrect;
                  const showWrong = showFeedback && isSelected && !option.isCorrect;

                  return (
                    <div
                      key={idx}
                      className={cn(
                        "relative flex items-center rounded-xl border-2 p-4 transition-all cursor-pointer",
                        !showFeedback && isSelected && "border-primary bg-primary/5",
                        !showFeedback && !isSelected && "border-border hover:border-primary/50",
                        showCorrect && "border-green-500 bg-green-500/10",
                        showWrong && "border-destructive bg-destructive/10"
                      )}
                      onClick={() => handleAnswerSelect(optionText)}
                    >
                      <RadioGroupItem
                        value={optionText}
                        id={`option-${idx}`}
                        className="mr-4"
                        disabled={showFeedback}
                      />
                      <Label
                        htmlFor={`option-${idx}`}
                        className="flex-1 cursor-pointer font-medium"
                      >
                        {optionText}
                      </Label>
                      
                      {showCorrect && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {showWrong && (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                  );
                })}
              </RadioGroup>

              {/* Feedback */}
              {showFeedback && (
                <div
                  className={cn(
                    "p-4 rounded-xl animate-fade-in",
                    isCorrect ? "bg-green-500/10 border border-green-500/20" : "bg-destructive/10 border border-destructive/20"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                    )}
                    <div>
                      <p className={cn("font-medium", isCorrect ? "text-green-600" : "text-destructive")}>
                        {isCorrect 
                          ? (language === "hi" ? "सही जवाब!" : "Correct!") 
                          : (language === "hi" ? "गलत जवाब" : "Incorrect")}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {language === "hi" ? currentQuestion.explanationHi : currentQuestion.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                {!showFeedback ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswer}
                    className="gap-2 bg-gradient-to-r from-primary to-accent"
                  >
                    {language === "hi" ? "जमा करें" : "Submit"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    className="gap-2 bg-gradient-to-r from-primary to-accent"
                  >
                    {currentQuestionIndex < quiz.questions.length - 1 ? (
                      <>
                        {language === "hi" ? "अगला" : "Next"}
                        <ChevronRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>{language === "hi" ? "परिणाम देखें" : "See Results"}</>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizModal;
