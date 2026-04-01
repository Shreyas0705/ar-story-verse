import { useLocation, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import type { GeneratedStory } from "@/hooks/useStoryGeneration";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-assets': any;
      'a-plane': any;
      'a-entity': any;
      'a-camera': any;
      'a-light': any;
      'a-marker': any;
      'a-sphere': any;
      'a-box': any;
      'a-text': any;
    }
  }
}

const ARPreview = () => {
  const location = useLocation();
  const story = location.state?.story as GeneratedStory | undefined;
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);

  useEffect(() => {
    const loadScripts = async () => {
      if (!(window as any).AFRAME) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://aframe.io/releases/1.4.2/aframe.min.js";
          script.onload = () => resolve();
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      if (!(window as any).AFRAME?.components?.['arjs-anchor']) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js";
          script.onload = () => resolve();
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      setIsLoaded(true);
    };
    loadScripts().catch(console.error);
  }, []);

  // Auto-advance scenes
  useEffect(() => {
    if (!story) return;
    const timer = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % story.scenes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [story]);

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

  const scene = story.scenes[currentScene];

  return (
    <div className="relative min-h-screen bg-background">
      <Navigation />

      {/* Controls */}
      <div className="fixed top-20 left-0 right-0 z-50 p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between bg-card/80 backdrop-blur-lg border border-border rounded-2xl p-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/create" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Link>
            </Button>
            <div className="text-center">
              <p className="text-sm font-medium text-primary">{story.title}</p>
              <p className="text-xs text-muted-foreground">Scene {currentScene + 1}/{story.scenes.length}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setCurrentScene(0)}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* AR Scene */}
      <div className="pt-36 px-4 pb-8">
        <div className="container mx-auto">
          {!isLoaded ? (
            <div className="flex flex-col items-center justify-center min-h-[600px] bg-card/50 border border-border rounded-3xl animate-fade-in">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-lg text-muted-foreground">Loading AR Experience...</p>
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden border border-border animate-fade-in" style={{ height: "70vh", zIndex: 1 }}>
              <a-scene
                embedded
                arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3; videoTexture: true;"
                vr-mode-ui="enabled: false"
                renderer="logarithmicDepthBuffer: true; alpha: true; antialias: true;"
                style={{ width: "100%", height: "100%" }}
              >
                <a-light type="ambient" color="#ffffff" intensity="0.6"></a-light>
                <a-light type="directional" color="#ffffff" intensity="1" position="1 1 1"></a-light>

                <a-marker preset="hiro">
                  {/* Floating story panel */}
                  <a-plane
                    position="0 0.5 0"
                    rotation="-90 0 0"
                    width="2"
                    height="1.5"
                    color="#ffffff"
                    opacity="0.95"
                  ></a-plane>
                  <a-sphere
                    position="1.2 0.8 0"
                    radius="0.05"
                    color="#FFD700"
                    animation="property: position; to: 1.2 1.2 0; dir: alternate; loop: true; dur: 2000"
                  ></a-sphere>
                  <a-sphere
                    position="-1.2 0.8 0"
                    radius="0.05"
                    color="#FFD700"
                    animation="property: position; to: -1.2 1.2 0; dir: alternate; loop: true; dur: 2500"
                  ></a-sphere>
                </a-marker>

                {/* Markerless fallback */}
                <a-entity position="0 0 -3">
                  <a-plane
                    position="0 1 0"
                    width="2"
                    height="1.5"
                    color="#ffffff"
                    opacity="0.95"
                  ></a-plane>
                </a-entity>

                <a-camera position="0 1.6 0"></a-camera>
              </a-scene>

              {/* Overlay with current scene */}
              <div className="absolute inset-0 pointer-events-none flex items-end justify-center p-6" style={{ zIndex: 10 }}>
                <div className="bg-card/90 backdrop-blur-lg border border-border rounded-2xl p-4 max-w-lg pointer-events-auto">
                  <p className="text-xs text-primary font-medium mb-1">{scene?.caption}</p>
                  <p className="text-sm text-foreground">{scene?.text}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ARPreview;
