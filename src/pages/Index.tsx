import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, QrCode } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/hero-bg.jpg";

const Index = () => {
  const { t } = useLanguage();
  // QR code for AR demo - using a free QR code API
  const arDemoUrl = window.location.origin + "/ar";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(arDemoUrl)}`;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        {/* Gradient Glow Effect */}
        <div className="absolute inset-0 z-0" style={{ 
          background: "var(--gradient-glow)"
        }} />

        {/* Content */}
        <div className="container relative z-10 px-4 py-20">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-sm font-medium text-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-float" />
                {t("home.poweredBy")}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t("home.heroTitle")}{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                {t("home.heroTitleHighlight")}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              {t("home.heroSubtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:shadow-[var(--shadow-glow)] transition-all duration-300"
                asChild
              >
                <Link to="/stories" className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {t("home.exploreStories")}
                </Link>
              </Button>

              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 border-2 hover:bg-secondary/20 hover:border-secondary transition-all duration-300"
                asChild
              >
                <Link to="/ar" className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  {t("home.tryDemo")}
                </Link>
              </Button>
            </div>

            {/* QR Code Section */}
            <div className="inline-flex flex-col items-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border animate-float">
              <div className="flex items-center gap-2 mb-3">
                <QrCode className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">{t("home.scanToExperience")}</span>
              </div>
              <div className="p-3 bg-background rounded-lg">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code for AR Demo" 
                  className="w-40 h-40"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{t("home.openOnMobile")}</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[var(--shadow-card)] group">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t("home.interactiveStories")}</h3>
              <p className="text-muted-foreground">
                {t("home.interactiveStoriesDesc")}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-[var(--shadow-card)] group">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t("home.arExperience")}</h3>
              <p className="text-muted-foreground">
                {t("home.arExperienceDesc")}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border hover:border-secondary/50 transition-all duration-300 hover:shadow-[var(--shadow-card)] group">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <QrCode className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t("home.easyAccess")}</h3>
              <p className="text-muted-foreground">
                {t("home.easyAccessDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
