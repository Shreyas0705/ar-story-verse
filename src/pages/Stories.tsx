import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import farmerImage from "@/assets/story-farmer.jpg";
import treeImage from "@/assets/story-tree.jpg";
import planetImage from "@/assets/story-planet.jpg";

const Stories = () => {
  const { t } = useLanguage();
  
  const stories = [
    {
      id: 1,
      titleKey: "stories.braveFarmer",
      descKey: "stories.braveFarmerDesc",
      image: farmerImage,
      color: "from-amber-500/20 to-orange-500/20",
    },
    {
      id: 2,
      titleKey: "stories.talkingTree",
      descKey: "stories.talkingTreeDesc",
      image: treeImage,
      color: "from-green-500/20 to-emerald-500/20",
    },
    {
      id: 3,
      titleKey: "stories.lostPlanet",
      descKey: "stories.lostPlanetDesc",
      image: planetImage,
      color: "from-purple-500/20 to-blue-500/20",
    },
  ];
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-28 pb-20">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-sm font-medium text-primary">{t("stories.collection")}</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {t("stories.chooseYour")}{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t("stories.arAdventure")}
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground">
            {t("stories.subtitle")}
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {stories.map((story, index) => (
            <div
              key={story.id}
              className="group relative animate-fade-in rounded-3xl overflow-hidden bg-gradient-to-br from-card to-card/50 border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-[var(--shadow-card)] hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${story.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={story.image}
                  alt={t(story.titleKey)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative p-6 space-y-4">
                <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">
                  {t(story.titleKey)}
                </h2>
                
                <p className="text-muted-foreground leading-relaxed">
                  {t(story.descKey)}
                </p>

                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-[var(--shadow-glow)] transition-all duration-300"
                >
                  <Link to="/ar" className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    {t("stories.viewInAr")}
                  </Link>
                </Button>
              </div>

              {/* Decorative Element */}
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles className="w-6 h-6 text-primary animate-float" />
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="max-w-2xl mx-auto text-center mt-20 p-8 rounded-3xl bg-gradient-to-br from-card to-card/50 border border-border">
          <h2 className="text-3xl font-bold mb-4">{t("stories.readyToExperience")}</h2>
          <p className="text-muted-foreground mb-6">
            {t("stories.jumpIntoDemo")}
          </p>
          <Button
            size="lg"
            asChild
            className="bg-gradient-to-r from-secondary to-primary hover:shadow-[var(--shadow-glow)] transition-all duration-300"
          >
            <Link to="/ar" className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              {t("stories.launchArDemo")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Stories;
