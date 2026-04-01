import { useState } from "react";
import Navigation from "@/components/Navigation";
import StoryInput from "@/components/create/StoryInput";
import GenerationProgress from "@/components/create/GenerationProgress";
import StoryViewer from "@/components/create/StoryViewer";
import { useStoryGeneration } from "@/hooks/useStoryGeneration";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";

const CreateStory = () => {
  const [prompt, setPrompt] = useState("");
  const { story, step, error, imageProgress, generateStory, reset } = useStoryGeneration();

  const handleGenerate = () => {
    if (prompt.trim().length >= 3) {
      generateStory(prompt.trim());
    }
  };

  const handleRegenerate = () => {
    reset();
    if (prompt.trim().length >= 3) {
      generateStory(prompt.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 px-4 pb-12">
        <div className="container mx-auto">
          {/* Idle - Show input */}
          {step === "idle" && (
            <StoryInput
              prompt={prompt}
              onPromptChange={setPrompt}
              onGenerate={handleGenerate}
              isGenerating={false}
            />
          )}

          {/* Generating - Show progress */}
          {(step === "generating-story" || step === "generating-images") && (
            <GenerationProgress
              step={step}
              imageProgress={imageProgress}
              totalScenes={story?.scenes.length || 5}
            />
          )}

          {/* Error */}
          {step === "error" && (
            <div className="max-w-md mx-auto text-center space-y-4 py-20 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold">Something went wrong</h3>
              <p className="text-muted-foreground">{error}</p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={reset} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Try Again
                </Button>
                <Button onClick={handleRegenerate}>Retry</Button>
              </div>
            </div>
          )}

          {/* Done - Show viewer */}
          {step === "done" && story && (
            <StoryViewer story={story} onRegenerate={handleRegenerate} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateStory;
