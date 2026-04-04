import { Play, Pause, RotateCcw, Volume2, VolumeX, RefreshCw, Sparkles, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoryPlayer } from "@/hooks/useStoryPlayer";
import type { GeneratedStory } from "@/hooks/useStoryGeneration";
import { Link } from "react-router-dom";

interface StoryViewerProps {
  story: GeneratedStory;
  onRegenerate: () => void;
}

const ScenePlaceholder = ({ index }: { index: number }) => {
  const gradients = [
    "from-primary/30 to-accent/30",
    "from-accent/30 to-secondary/30",
    "from-secondary/30 to-primary/30",
    "from-primary/20 to-secondary/40",
    "from-accent/20 to-primary/40",
  ];
  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center`}>
      <span className="text-6xl">🎨</span>
    </div>
  );
};

const StoryViewer = ({ story, onRegenerate }: StoryViewerProps) => {
  const {
    currentScene,
    setCurrentScene,
    isPlaying,
    isNarrating,
    play,
    pause,
    restart,
    narrate,
    stopNarration,
  } = useStoryPlayer(story.scenes, story.fullText);

  const scene = story.scenes[currentScene];

  const handleOpenARPreview = () => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem("ar-story-preview", JSON.stringify(story));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {story.title}
        </h2>
      </div>

      {/* Scene Viewer */}
      <div className="relative rounded-2xl overflow-hidden border border-border bg-card aspect-video">
        {/* Scene Image */}
        <div className="absolute inset-0 transition-opacity duration-1000">
          {scene?.imageUrl ? (
            <img
              src={scene.imageUrl}
              alt={scene.caption}
              className="w-full h-full object-cover"
            />
          ) : (
            <ScenePlaceholder index={currentScene} />
          )}
        </div>

        {/* Caption overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <p className="text-white text-sm font-medium mb-1">
            Scene {currentScene + 1} of {story.scenes.length}
          </p>
          <h3 className="text-white text-xl font-bold mb-2">{scene?.caption}</h3>
          <p className="text-white/90 text-sm leading-relaxed">{scene?.text}</p>
        </div>

        {/* Scene indicator dots */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
          {story.scenes.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentScene(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === currentScene
                  ? "bg-white scale-125 shadow-lg"
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" size="sm" onClick={isPlaying ? pause : play} className="gap-2 rounded-xl">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? "Pause" : "Play"}
        </Button>

        <Button variant="outline" size="sm" onClick={restart} className="gap-2 rounded-xl">
          <RotateCcw className="w-4 h-4" />
          Restart
        </Button>

        <Button
          variant={isNarrating ? "default" : "outline"}
          size="sm"
          onClick={isNarrating ? stopNarration : narrate}
          className={`gap-2 rounded-xl ${isNarrating ? "bg-primary" : ""}`}
        >
          {isNarrating ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          {isNarrating ? "Stop Narration" : "Narrate"}
        </Button>

        <Button variant="outline" size="sm" onClick={onRegenerate} className="gap-2 rounded-xl">
          <RefreshCw className="w-4 h-4" />
          Regenerate
        </Button>

        <Button variant="secondary" size="sm" asChild className="gap-2 rounded-xl">
          <Link to="/ar-preview" state={{ story }} onClick={handleOpenARPreview}>
            <Sparkles className="w-4 h-4" />
            View in AR
          </Link>
        </Button>
      </div>

      {/* Full Story Text */}
      <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border">
        <h3 className="text-lg font-semibold mb-3 text-primary">Full Story</h3>
        <p className="text-muted-foreground leading-relaxed">{story.fullText}</p>
      </div>
    </div>
  );
};

export default StoryViewer;
