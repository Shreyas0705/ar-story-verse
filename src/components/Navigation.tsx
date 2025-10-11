import { Link, useLocation } from "react-router-dom";
import { BookOpen, Home, Sparkles, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Sparkles className="w-6 h-6 text-primary group-hover:animate-glow" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AR Storytelling
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </Button>

            <Button
              variant={isActive("/stories") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/stories" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Stories</span>
              </Link>
            </Button>

            <Button
              variant={isActive("/research") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/research" className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4" />
                <span className="hidden sm:inline">Research</span>
              </Link>
            </Button>

            <Button
              variant={isActive("/ar") ? "secondary" : "ghost"}
              size="sm"
              asChild
              className="animate-glow"
            >
              <Link to="/ar" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">AR Demo</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
