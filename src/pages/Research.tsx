import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, TrendingUp, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Research = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
            {t("research.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in">
            {t("research.subtitle")}
          </p>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold mb-12 text-center">{t("research.ourApproach")}</h2>
          
          <Card className="mb-8 animate-fade-in hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl">{t("research.methodology")}</CardTitle>
              <CardDescription className="text-base">
                {t("research.methodologyDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>{t("research.longitudinal")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>{t("research.comparative")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>{t("research.cognitive")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>{t("research.userExperience")}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Key Findings */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold mb-12 text-center">{t("research.keyFindings")}</h2>
          
          <Card className="mb-8 animate-fade-in hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl">{t("research.outcomes")}</CardTitle>
              <CardDescription className="text-base">
                {t("research.outcomesDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <TrendingUp className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">{t("research.increase67")}</p>
                    <p className="text-sm text-muted-foreground">{t("research.increase67Desc")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <BookOpen className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">{t("research.improvement42")}</p>
                    <p className="text-sm text-muted-foreground">{t("research.improvement42Desc")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <Award className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">{t("research.participants89")}</p>
                    <p className="text-sm text-muted-foreground">{t("research.participants89Desc")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <Users className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">{t("research.significant")}</p>
                    <p className="text-sm text-muted-foreground">{t("research.significantDesc")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Research in Numbers */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold mb-4 text-center">Research in Numbers</h2>
          <p className="text-muted-foreground text-center mb-12">
            Key statistics from our ongoing research into AR-enhanced reading experiences.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center animate-fade-in hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="text-5xl font-bold text-primary mb-2">3,500+</div>
                <CardDescription className="text-base">
                  Young readers participated in our studies across 12 countries
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center animate-fade-in hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="text-5xl font-bold text-primary mb-2">67%</div>
                <CardDescription className="text-base">
                  Average increase in time spent reading voluntarily
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center animate-fade-in hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="text-5xl font-bold text-primary mb-2">42%</div>
                <CardDescription className="text-base">
                  Improvement in comprehension and retention of story elements
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Published Research */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold mb-4 text-center">Published Research</h2>
          <p className="text-muted-foreground text-center mb-12">
            Our team regularly publishes research findings in academic journals and presents at conferences.
          </p>
          
          <div className="space-y-6">
            <Card className="animate-fade-in hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="text-sm text-primary font-semibold mb-2">Journal of Educational Technology, 2023</div>
                <CardTitle className="text-xl mb-3">
                  "Augmented Reality in Literacy: A Study of AR's Impact on Reading Engagement Among Digital Natives"
                </CardTitle>
                <CardDescription>Chen, E., Johnson, M., & Kim, D.</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="animate-fade-in hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="text-sm text-primary font-semibold mb-2">International Conference on Learning Sciences, 2022</div>
                <CardTitle className="text-xl mb-3">
                  "Gamified Reading: How Interactive AR Elements Enhance Comprehension and Retention"
                </CardTitle>
                <CardDescription>Patel, S., Johnson, M., & Chen, E.</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="animate-fade-in hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="text-sm text-primary font-semibold mb-2">Cognitive Development Journal, 2022</div>
                <CardTitle className="text-xl mb-3">
                  "Neurological Responses to Traditional vs. AR-Enhanced Reading Experiences in Adolescents"
                </CardTitle>
                <CardDescription>Kim, D., Chen, E., & Neuroscience Research Team</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Research Partners */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold mb-4 text-center">Research Partners</h2>
          <p className="text-muted-foreground text-center mb-12">
            We collaborate with leading institutions to advance our understanding of AR in education.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center animate-fade-in hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl">Stanford University</CardTitle>
                <CardDescription>Department of Education Technology Research</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center animate-fade-in hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl">National Literacy Foundation</CardTitle>
                <CardDescription>Youth Reading Initiative</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center animate-fade-in hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl">Global Education Consortium</CardTitle>
                <CardDescription>Future of Learning Research Group</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Participate CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">{t("research.participate")}</h2>
          <p className="text-xl text-muted-foreground mb-8">
            {t("research.participateDesc")}
          </p>
          <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl animate-glow">
            {t("research.getInvolved")}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center text-muted-foreground">
            <p className="mb-4 font-semibold text-foreground">{t("nav.brandName")}</p>
            <p className="text-sm mb-4">{t("research.footerDesc")}</p>
            <p className="text-sm">{t("research.copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Research;
