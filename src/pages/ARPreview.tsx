import { useLocation, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Move,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useStoryPlayer } from "@/hooks/useStoryPlayer";
import { useGazeSelect } from "@/hooks/useGazeSelect";
import GazeReticle from "@/components/ar/GazeReticle";
import { Switch } from "@/components/ui/switch";
import type { GeneratedStory } from "@/hooks/useStoryGeneration";

const STORY_STORAGE_KEY = "ar-story-preview";

const readStoredStory = (): GeneratedStory | undefined => {
  if (typeof window === "undefined") return undefined;

  try {
    const rawStory = window.sessionStorage.getItem(STORY_STORAGE_KEY);
    return rawStory ? (JSON.parse(rawStory) as GeneratedStory) : undefined;
  } catch {
    return undefined;
  }
};

const SceneFallback = ({ index, caption }: { index: number; caption?: string }) => {
  const gradients = [
    "from-primary/30 via-accent/15 to-secondary/25",
    "from-accent/25 via-primary/10 to-secondary/20",
    "from-secondary/30 via-primary/10 to-accent/20",
  ];

  return (
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradients[index % gradients.length]}`}>
      <div className="flex max-w-xs flex-col items-center gap-3 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background/70 text-3xl shadow-sm">
          ✨
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Scene preview</p>
          <p className="mt-1 text-xs text-muted-foreground">{caption || "Your generated scene will appear here."}</p>
        </div>
      </div>
    </div>
  );
};

interface ARExperienceProps {
  story: GeneratedStory;
  cameraError: string | null;
  cameraReady: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const ARExperience = ({ story, cameraError, cameraReady, videoRef }: ARExperienceProps) => {
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

  const gaze = useGazeSelect();

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const scene = story.scenes[currentScene];

  useEffect(() => {
    setImageFailed(false);
  }, [currentScene, scene?.imageUrl]);

  const handleDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStart.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleDragMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    setPosition({
      x: event.clientX - dragStart.current.x,
      y: event.clientY - dragStart.current.y,
    });
  };

  const handleDragEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const goToPreviousScene = () => {
    setCurrentScene((previous) => Math.max(0, previous - 1));
  };

  const goToNextScene = () => {
    setCurrentScene((previous) => Math.min(story.scenes.length - 1, previous + 1));
  };

  const resetCardPosition = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/40 to-background" />
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${cameraError ? "opacity-0" : "opacity-100"}`}
        playsInline
        muted
        autoPlay
      />
      <div className="absolute inset-0 bg-background/30" />

      {/* Gaze reticle */}
      {gaze.enabled && (
        <GazeReticle dwellProgress={gaze.dwellProgress} gazeLabel={gaze.gazeLabel} offset={gaze.reticleOffset} />
      )}

      {/* Motion denied prompt */}
      {gaze.enabled && gaze.motionDenied && (
        <div className="absolute inset-x-0 top-24 z-40 px-4">
          <div className="mx-auto flex max-w-sm items-center justify-between rounded-2xl border border-border bg-card/90 px-4 py-3 text-sm shadow-sm backdrop-blur-xl">
            <span className="text-muted-foreground">Motion access denied</span>
            <Button size="sm" variant="outline" onClick={gaze.requestMotion}>Enable Motion</Button>
          </div>
        </div>
      )}

      {!cameraReady && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
          <div className="text-center">
            <div className="mx-auto mb-3 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Opening camera for AR preview...</p>
          </div>
        </div>
      )}

      <div className="absolute inset-x-0 top-0 z-30 p-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-2xl border border-border bg-background/80 px-3 py-3 shadow-sm backdrop-blur-xl">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/create" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>

          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-sm font-semibold text-primary">{story.title}</p>
            <p className="text-xs text-muted-foreground">
              Scene {currentScene + 1} / {story.scenes.length}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="headset-toggle" className="text-xs text-muted-foreground">Headset</label>
            <Switch id="headset-toggle" checked={gaze.enabled} onCheckedChange={gaze.toggle} />
          </div>

          <Button variant="outline" size="icon" onClick={restart} data-gaze data-gaze-label="Restart">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {cameraError && (
        <div className="absolute inset-x-0 top-24 z-30 px-4">
          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card/90 px-4 py-3 text-center text-sm text-muted-foreground shadow-sm backdrop-blur-xl">
            {cameraError} You can still explore the story card below.
          </div>
        </div>
      )}

      <div className="absolute inset-0 z-20 flex items-center justify-center px-4 pb-32 pt-28">
        <div
          className="relative w-full max-w-[30rem]"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? "none" : "transform 200ms ease-out",
          }}
        >
          <div
            className="mb-3 flex touch-none items-center justify-between rounded-2xl border border-border bg-background/80 px-4 py-2 text-xs text-muted-foreground shadow-sm backdrop-blur-xl"
            onPointerDown={handleDragStart}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
            onPointerCancel={handleDragEnd}
          >
            <div className="flex items-center gap-2">
              <Move className="h-3.5 w-3.5" />
              Drag to position
            </div>
            <Button variant="ghost" size="sm" onClick={resetCardPosition}>
              Center
            </Button>
          </div>

          <div
            className="overflow-hidden rounded-[28px] border border-border bg-card/95 shadow-[0_24px_80px_-32px_hsl(var(--foreground)/0.55)] backdrop-blur-xl"
            style={{ boxShadow: "0 0 0 1px hsl(var(--border) / 0.8), 0 24px 80px -32px hsl(var(--foreground) / 0.55)" }}
          >
            <button
              type="button"
              onClick={goToNextScene}
              className="relative block aspect-video w-full overflow-hidden bg-muted text-left"
            >
              {scene?.imageUrl && !imageFailed ? (
                <img
                  src={scene.imageUrl}
                  alt={scene.caption}
                  className="h-full w-full object-cover"
                  draggable={false}
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <SceneFallback index={currentScene} caption={scene?.caption} />
              )}

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 via-background/45 to-transparent px-4 pb-4 pt-10">
                <p className="text-[11px] uppercase tracking-[0.24em] text-primary">Tap image to advance</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{scene?.caption}</p>
              </div>
            </button>

            <div className="space-y-4 p-4">
              <p className="text-sm leading-relaxed text-foreground">{scene?.text}</p>

              <div className="flex flex-wrap gap-2">
                {story.scenes.map((storyScene, index) => (
                  <button
                    key={`${storyScene.sceneNumber}-${index}`}
                    type="button"
                    onClick={() => setCurrentScene(index)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      index === currentScene
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background px-3 py-2">Tap the image for the next scene</div>
                <div className="rounded-2xl border border-border bg-background px-3 py-2">Use the drag bar to place the story in view</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-30 p-3">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-background/85 p-3 shadow-sm backdrop-blur-xl">
          <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${((currentScene + 1) / story.scenes.length) * 100}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button variant="outline" size="icon" onClick={goToPreviousScene} disabled={currentScene === 0} data-gaze data-gaze-label="Previous">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={isPlaying ? pause : play} data-gaze data-gaze-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextScene} disabled={currentScene === story.scenes.length - 1} data-gaze data-gaze-label="Next">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant={isNarrating ? "secondary" : "outline"} size="sm" onClick={isNarrating ? stopNarration : narrate} data-gaze data-gaze-label={isNarrating ? "Stop" : "Narrate"}>
              {isNarrating ? <VolumeX className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
              {isNarrating ? "Stop" : "Narrate"}
            </Button>
            <Button variant="outline" size="icon" onClick={() => setScale((value) => Math.max(0.8, value - 0.15))} data-gaze data-gaze-label="Zoom Out">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setScale((value) => Math.min(1.8, value + 0.15))} data-gaze data-gaze-label="Zoom In">
              <ZoomIn className="h-4 w-4" />
            </Button>
            {gaze.enabled && (
              <Button variant="outline" size="sm" onClick={gaze.recenter} data-gaze data-gaze-label="Recenter">
                Recenter
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ARPreview = () => {
  const location = useLocation();
  const incomingStory = location.state?.story as GeneratedStory | undefined;
  const [storedStory, setStoredStory] = useState<GeneratedStory | undefined>(() => readStoredStory());
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const story = incomingStory ?? storedStory;

  useEffect(() => {
    if (!incomingStory || typeof window === "undefined") return;

    try {
      window.sessionStorage.setItem(STORY_STORAGE_KEY, JSON.stringify(incomingStory));
    } catch {
      // sessionStorage may be full due to large base64 images — ignore
    }
    setStoredStory(incomingStory);
  }, [incomingStory]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let isCancelled = false;

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraReady(true);
        setCameraError("Camera access is not supported on this device.");
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (isCancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }

        setCameraError(null);
        setCameraReady(true);
      } catch {
        setCameraReady(true);
        setCameraError("Camera unavailable right now.");
      }
    };

    startCamera();

    return () => {
      isCancelled = true;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  if (!story) {
    return (
      <div className="min-h-screen bg-background px-4 py-24">
        <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-foreground">No story is loaded for AR preview.</p>
          <p className="text-sm text-muted-foreground">Generate a story first, then open the AR preview from the story player.</p>
          <Button asChild>
            <Link to="/create" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Create
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return <ARExperience story={story} cameraError={cameraError} cameraReady={cameraReady} videoRef={videoRef} />;
};

export default ARPreview;
