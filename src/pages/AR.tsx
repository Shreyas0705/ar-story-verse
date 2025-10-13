import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, Volume2, VolumeX, Info, Sparkles } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-box': any;
      'a-sphere': any;
      'a-cylinder': any;
      'a-plane': any;
      'a-sky': any;
      'a-camera': any;
      'a-entity': any;
      'a-light': any;
      'a-marker': any;
    }
  }
}

const AR = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoUrl = searchParams.get('video');
  const [isAframeLoaded, setIsAframeLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Load A-Frame and AR.js
    const aframeScript = document.createElement("script");
    aframeScript.src = "https://aframe.io/releases/1.4.2/aframe.min.js";
    aframeScript.async = true;
    
    const arScript = document.createElement("script");
    arScript.src = "https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js";
    arScript.async = true;

    aframeScript.onload = () => {
      arScript.onload = () => {
        setIsAframeLoaded(true);
      };
      document.body.appendChild(arScript);
    };

    document.body.appendChild(aframeScript);

    // Auto-play audio with user interaction
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
      }
    };

    document.addEventListener('click', playAudio, { once: true });

    return () => {
      document.removeEventListener('click', playAudio);
      if (aframeScript.parentNode) aframeScript.remove();
      if (arScript.parentNode) arScript.remove();
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      <Navigation />
      
      {/* Audio */}
      <audio 
        ref={audioRef} 
        loop 
        preload="auto"
      >
        <source src="https://www.bensound.com/bensound-music/bensound-creativeminds.mp3" type="audio/mpeg" />
      </audio>

      {/* Controls Overlay */}
      <div className="fixed top-20 left-0 right-0 z-50 p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between bg-card/80 backdrop-blur-lg border border-border rounded-2xl p-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <Link to="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">{t("ar.backHome")}</span>
              </Link>
            </Button>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                <Info className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary">{t("ar.moveDevice")}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-36 px-4 pb-8">
        <div className="container mx-auto">
          {videoUrl ? (
            /* Video Player */
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-card to-card/50 border border-border shadow-lg animate-fade-in">
                <video 
                  ref={videoRef}
                  className="w-full h-full object-contain bg-black"
                  controls
                  autoPlay
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          ) : !isAframeLoaded ? (
            <div className="flex flex-col items-center justify-center min-h-[600px] bg-card/50 backdrop-blur-sm border border-border rounded-3xl animate-fade-in">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-lg text-muted-foreground">{t("ar.loadingAr")}</p>
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden border border-border animate-fade-in" style={{ height: '70vh' }}>
              <a-scene
                embedded
                arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3; videoTexture: true;"
                vr-mode-ui="enabled: false"
                renderer="logarithmicDepthBuffer: true; alpha: true; antialias: true;"
                style={{ width: '100%', height: '100%' }}
              >
                {/* Lighting */}
                <a-light type="ambient" color="#ffffff" intensity="0.5"></a-light>
                <a-light type="directional" color="#ffffff" intensity="1" position="1 1 1"></a-light>

                {/* Marker-based AR Entity */}
                <a-marker preset="hiro">
                  {/* Tree-like structure */}
                  <a-cylinder 
                    position="0 0.5 0" 
                    radius="0.1" 
                    height="1" 
                    color="#8B4513"
                  ></a-cylinder>
                  
                  {/* Leaves/Crown */}
                  <a-sphere 
                    position="0 1.2 0" 
                    radius="0.4" 
                    color="#22c55e"
                    animation="property: rotation; to: 0 360 0; loop: true; dur: 10000"
                  ></a-sphere>
                  
                  <a-sphere 
                    position="0.2 1 0.2" 
                    radius="0.3" 
                    color="#10b981"
                    animation="property: rotation; to: 0 360 0; loop: true; dur: 8000"
                  ></a-sphere>
                  
                  <a-sphere 
                    position="-0.2 1 -0.2" 
                    radius="0.3" 
                    color="#16a34a"
                    animation="property: rotation; to: 0 360 0; loop: true; dur: 12000"
                  ></a-sphere>

                  {/* Floating orbs */}
                  <a-sphere 
                    position="0.5 1.5 0" 
                    radius="0.1" 
                    color="#a855f7"
                    animation="property: position; to: 0.5 1.8 0; dir: alternate; loop: true; dur: 2000"
                  ></a-sphere>
                  
                  <a-sphere 
                    position="-0.5 1.5 0" 
                    radius="0.1" 
                    color="#06b6d4"
                    animation="property: position; to: -0.5 1.8 0; dir: alternate; loop: true; dur: 2500"
                  ></a-sphere>
                </a-marker>

                {/* Markerless fallback */}
                <a-entity position="0 0 -3">
                  <a-box 
                    position="0 1 0" 
                    rotation="0 45 0" 
                    color="#a855f7"
                    animation="property: rotation; to: 0 405 0; loop: true; dur: 10000"
                  ></a-box>
                </a-entity>

                <a-camera position="0 1.6 0"></a-camera>
              </a-scene>
            </div>
          )}

          {/* Instructions - Only show for AR, not video */}
          {!videoUrl && (
            <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border">
              <h3 className="text-xl font-bold mb-3 text-primary">{t("ar.withMarker")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("ar.markerDesc")}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border">
              <h3 className="text-xl font-bold mb-3 text-accent">{t("ar.markerless")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("ar.markerlessDesc")}
              </p>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AR;
