import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, Volume2, VolumeX, Info, Sparkles, Play, Pause, Trophy } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import QuizModal from "@/components/quiz/QuizModal";
import { getQuizByVideoUrl, getQuizByStoryId } from "@/data/quizData";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-assets': any;
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
  const videoUrl = searchParams.get('video');
  const [isAframeLoaded, setIsAframeLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Get quiz based on video URL or default to first story
  const quiz = videoUrl ? getQuizByVideoUrl(videoUrl) : getQuizByStoryId(1);

  useEffect(() => {
    const loadScripts = async () => {
      // Only load A-Frame if not already present
      if (!(window as any).AFRAME) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://aframe.io/releases/1.4.2/aframe.min.js";
          script.onload = () => resolve();
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Only load AR.js if not already present
      if (!(window as any).AFRAME?.components?.['arjs-anchor']) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js";
          script.onload = () => resolve();
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      setIsAframeLoaded(true);

      // Auto-play video when AR loads
      setTimeout(() => {
        const video = document.getElementById('ar-video') as HTMLVideoElement;
        if (video) {
          video.play().catch(console.error);
        }
      }, 1000);
    };

    loadScripts().catch(console.error);

    // Auto-play audio with user interaction
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
      }
    };

    document.addEventListener('click', playAudio, { once: true });

    return () => {
      document.removeEventListener('click', playAudio);
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
    
    // Also toggle video mute
    const video = document.getElementById('video-asset') as HTMLVideoElement;
    if (video) {
      video.muted = !video.muted;
    }
  };

  const togglePlayPause = () => {
    const video = document.getElementById('video-asset') as HTMLVideoElement;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
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

              {videoUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePlayPause}
                  className="gap-2"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span className="hidden sm:inline">{t("ar.pause")}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span className="hidden sm:inline">{t("ar.play")}</span>
                    </>
                  )}
                </Button>
              )}

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
          {!isAframeLoaded ? (
            <div className="flex flex-col items-center justify-center min-h-[600px] bg-card/50 backdrop-blur-sm border border-border rounded-3xl animate-fade-in">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-lg text-muted-foreground">{t("ar.loadingAr")}</p>
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden border border-border animate-fade-in" style={{ height: '70vh' }}>
              {/* Hidden video element for AR texture */}
              {videoUrl && (
                <video 
                  id="ar-video"
                  loop
                  muted={isMuted}
                  playsInline
                  crossOrigin="anonymous"
                  style={{ display: 'none' }}
                >
                  <source src={videoUrl} type="video/mp4" />
                </video>
              )}
              
              <a-scene
                embedded
                arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3; videoTexture: true;"
                vr-mode-ui="enabled: false"
                renderer="logarithmicDepthBuffer: true; alpha: true; antialias: true;"
                style={{ width: '100%', height: '100%' }}
              >
                {/* Assets */}
                <a-assets>
                  {videoUrl && <video id="video-asset" src={videoUrl} loop autoPlay playsInline crossOrigin="anonymous"></video>}
                </a-assets>

                {/* Lighting */}
                <a-light type="ambient" color="#ffffff" intensity="0.5"></a-light>
                <a-light type="directional" color="#ffffff" intensity="1" position="1 1 1"></a-light>

                {/* Marker-based AR Entity */}
                <a-marker preset="hiro">
                  {videoUrl ? (
                    // Video screen in AR
                    <>
                      <a-plane 
                        position="0 0.5 0" 
                        rotation="-90 0 0"
                        width="2" 
                        height="1.5"
                        material="src: #video-asset"
                      ></a-plane>
                      
                      {/* Decorative frame */}
                      <a-box 
                        position="0 0.4 0" 
                        width="2.1" 
                        height="0.1" 
                        depth="1.6"
                        color="#8B4513"
                      ></a-box>
                      
                      {/* Floating sparkles around video */}
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
                    </>
                  ) : (
                    // Default tree when no video
                    <>
                      <a-cylinder 
                        position="0 0.5 0" 
                        radius="0.1" 
                        height="1" 
                        color="#8B4513"
                      ></a-cylinder>
                      
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
                    </>
                  )}
                </a-marker>

                {/* Markerless fallback */}
                <a-entity position="0 0 -3">
                  {videoUrl ? (
                    <a-plane 
                      position="0 1 0" 
                      rotation="0 0 0"
                      width="2" 
                      height="1.5"
                      material="src: #video-asset"
                    ></a-plane>
                  ) : (
                    <a-box 
                      position="0 1 0" 
                      rotation="0 45 0" 
                      color="#a855f7"
                      animation="property: rotation; to: 0 405 0; loop: true; dur: 10000"
                    ></a-box>
                  )}
                </a-entity>

                <a-camera position="0 1.6 0"></a-camera>
              </a-scene>
            </div>
          )}

          {/* Instructions */}
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

          {/* Quiz Call to Action */}
          {quiz && (
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 animate-fade-in">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/20">
                    <Trophy className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{t("ar.storyComplete")}</h3>
                    <p className="text-muted-foreground">{t("ar.testKnowledge")}</p>
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={() => setShowQuiz(true)}
                  className="gap-2 bg-gradient-to-r from-primary to-accent hover:shadow-[var(--shadow-glow)] transition-all duration-300"
                >
                  <Sparkles className="w-5 h-5" />
                  {t("ar.takeQuiz")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Modal */}
      {quiz && (
        <QuizModal
          quiz={quiz}
          isOpen={showQuiz}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </div>
  );
};

export default AR;
