import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface StoryInputProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const StoryInput = ({ prompt, onPromptChange, onGenerate, isGenerating }: StoryInputProps) => {
  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Create Your Story
          </span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Describe your story idea and watch AI bring it to life with images, narration, and AR
        </p>
      </div>

      <Textarea
        placeholder="Enter your story idea... (e.g., 'A little robot who learns to paint beautiful sunsets')"
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        className="min-h-[120px] text-base resize-none rounded-2xl border-2 border-border focus:border-primary"
        disabled={isGenerating}
      />

      <Button
        size="lg"
        onClick={onGenerate}
        disabled={isGenerating || prompt.trim().length < 3}
        className="w-full gap-2 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-[var(--shadow-glow)] transition-all duration-300"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Story
          </>
        )}
      </Button>
    </div>
  );
};

export default StoryInput;
