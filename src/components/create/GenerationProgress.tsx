import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GenerationProgressProps {
  step: string;
  imageProgress: number;
  totalScenes: number;
}

const GenerationProgress = ({ step, imageProgress, totalScenes }: GenerationProgressProps) => {
  const isGeneratingStory = step === "generating-story";
  const isGeneratingImages = step === "generating-images";
  const progressPercent = isGeneratingImages && totalScenes > 0
    ? Math.round((imageProgress / totalScenes) * 100)
    : isGeneratingStory ? 20 : 0;

  return (
    <div className="max-w-md mx-auto flex flex-col items-center gap-6 py-20 animate-fade-in">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent animate-pulse" />
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">
          {isGeneratingStory ? "✍️ Writing your story..." : "🎨 Generating scene images..."}
        </h3>
        <p className="text-muted-foreground text-sm">
          {isGeneratingStory
            ? "Our AI is crafting a unique story based on your idea"
            : `Creating image ${imageProgress} of ${totalScenes}`}
        </p>
      </div>

      <div className="w-full space-y-1">
        <Progress value={progressPercent} className="h-2" />
        <p className="text-xs text-muted-foreground text-right">{progressPercent}%</p>
      </div>
    </div>
  );
};

export default GenerationProgress;
