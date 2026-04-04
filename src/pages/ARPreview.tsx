import { useLocation, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, RotateCcw, Play, Pause, Volume2, VolumeX,
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Move
} from "lucide-react";
import { useStoryPlayer } from "@/hooks/useStoryPlayer";
import type { GeneratedStory } from "@/hooks/useStoryGeneration";

const ARPreview = () => {
  const location = useLocation();
  const story = location.state?.story as GeneratedStory | undefined;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Camera setup
  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
        }
      } catch {
        setCameraError(true);
        setCameraReady(true); // still show content with fallback bg
      }
    };
    startCamera();
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  if (!story) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 px-4 flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-muted-foreground text-lg">No story to display in AR</p>
          <Button asChild>
            <Link to="/create" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Create a Story
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return <ARScene story={story} videoRef={videoRef} cameraReady={cameraReady} cameraError={cameraError} scale={scale} setScale={setScale} position={position} setPosition={setPosition} isDragging={isDragging} setIsDragging={setIsDragging} dragStart={dragStart} />;
};

interface ARSceneProps {
  story: GeneratedStory;
  videoRef: React.RefObject<HTMLVideoElement>;
  cameraReady: boolean;
  cameraError: boolean;
  scale: number;
  setScale: (s: number) => void;
  position: { x: number; y: number };
  setPosition: (p: { x: number; y: number }) => void;
  isDragging: boolean;
  setIsDragging: (d: boolean) => void;
  dragStart: React.MutableRefObject<{ x: number; y: number }>;
}

const ScenePlaceholder = ({ index }: { index: number }) => {
  const gradients = [
    "from-purple-500/40 to-blue-500/40",
    "from-blue-500/40 to-green-500/40",
    "from-green-500/40 to-yellow-500/40",
    "from-yellow-500/40 to-red-500/40",
    "from-red-500/40 to-purple-500/40",
  ];
  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center`}>
      <span className="text-5xl">🎨</span>
    </div>
  );
};

const ARScene = ({ story, videoRef, cameraReady, cameraError, scale, setScale, position, setPosition, isDragging, setIsDragging, dragStart }: ARSceneProps) => {
  const {
    currentScene, setCurrentScene, isPlaying, isNarrating,
    play, pause, restart, narrate, stopNarration,
  } = useStoryPlayer(story.scenes, story.fullText);

  const scene = story.scenes[currentScene];
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };
  const handlePointerUp = () => setIsDragging(false);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
      {/* Camera Feed Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
        autoPlay
      />
      {/* Fallback background if no camera */}
      {cameraError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      )}

      {/* Loading overlay */}
      {!cameraReady && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-white text-sm">Initializing AR Camera...</p>
          </div>
        </div>
      )}

      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 z-40 p-3 safe-area-top">
        <div className="flex items-center justify-between bg-black/60 backdrop-blur-md rounded-xl p-3">
          <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/20">
            <Link to="/create" className="flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs">Back</span>
            </Link>
          </Button>
          <div className="text-center flex-1 mx-2">
            <p className="text-xs font-semibold text-primary truncate">{story.title}</p>
            <p className="text-[10px] text-white/60">Scene {currentScene + 1}/{story.scenes.length}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={restart} className="text-white hover:bg-white/20">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Floating Story Card - draggable & scalable */}
      <div
        ref={containerRef}
        className="absolute z-30 cursor-grab active:cursor-grabbing"
        style={{
          left: `calc(50% + ${position.x}px)`,
          top: `calc(40% + ${position.y}px)`,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transition: isDragging ? "none" : "transform 0.3s ease",
          width: "min(85vw, 420px)",
        }}
        onPointerDown={handlePointerDown}
      >
        {/* Glowing border effect */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ boxShadow: "0 0 30px rgba(139, 92, 246, 0.3), 0 0 60px rgba(139, 92, 246, 0.1)" }}>
          {/* Scene Image */}
          <div className="aspect-video bg-black/40 relative overflow-hidden">
            {scene?.imageUrl ? (
              <img
                src={scene.imageUrl}
                alt={scene.caption}
                className="w-full h-full object-cover transition-all duration-700"
                draggable={false}
              />
            ) : (
              <ScenePlaceholder index={currentScene} />
            )}
            {/* Scene dots */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {story.scenes.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrentScene(i); }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentScene ? "bg-white scale-125 shadow-lg" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Caption & Text */}
          <div className="bg-black/80 backdrop-blur-md p-3">
            <p className="text-primary text-xs font-semibold mb-1">{scene?.caption}</p>
            <p className="text-white/90 text-xs leading-relaxed">{scene?.text}</p>
          </div>
        </div>

        {/* Decorative floating particles */}
        <div className="absolute -top-3 -right-3 w-4 h-4 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0s", animationDuration: "2s" }} />
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: "0.5s", animationDuration: "2.5s" }} />
        <div className="absolute top-1/2 -right-4 w-2 h-2 bg-yellow-400/60 rounded-full animate-bounce" style={{ animationDelay: "1s", animationDuration: "3s" }} />
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-40 p-3 safe-area-bottom">
        <div className="bg-black/60 backdrop-blur-md rounded-xl p-3">
          {/* Playback controls */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <Button
              variant="ghost" size="icon"
              onClick={() => setCurrentScene(Math.max(0, currentScene - 1))}
              disabled={currentScene === 0}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost" size="icon"
              onClick={isPlaying ? pause : play}
              className="text-white hover:bg-white/20 h-10 w-10 rounded-full border border-white/30"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost" size="icon"
              onClick={() => setCurrentScene(Math.min(story.scenes.length - 1, currentScene + 1))}
              disabled={currentScene === story.scenes.length - 1}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Secondary controls */}
          <div className="flex items-center justify-center gap-1.5">
            <Button
              variant="ghost" size="sm"
              onClick={isNarrating ? stopNarration : narrate}
              className={`text-white hover:bg-white/20 text-[10px] gap-1 h-7 px-2 ${isNarrating ? "bg-primary/40" : ""}`}
            >
              {isNarrating ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              {isNarrating ? "Stop" : "Narrate"}
            </Button>

            <Button
              variant="ghost" size="sm"
              onClick={() => setScale(Math.min(2, scale + 0.2))}
              className="text-white hover:bg-white/20 h-7 w-7 p-0"
            >
              <ZoomIn className="w-3 h-3" />
            </Button>

            <Button
              variant="ghost" size="sm"
              onClick={() => setScale(Math.max(0.5, scale - 0.2))}
              className="text-white hover:bg-white/20 h-7 w-7 p-0"
            >
              <ZoomOut className="w-3 h-3" />
            </Button>

            <Button
              variant="ghost" size="sm"
              onClick={() => { setPosition({ x: 0, y: 0 }); setScale(1); }}
              className="text-white hover:bg-white/20 h-7 w-7 p-0"
            >
              <Move className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARPreview;
