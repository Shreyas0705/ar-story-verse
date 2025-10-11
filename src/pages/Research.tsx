import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, TrendingUp, Award } from "lucide-react";

const Research = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
            Our Research
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in">
            Exploring the impact of augmented reality on reading engagement, comprehension, and cognitive development.
          </p>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Approach</h2>
          
          <Card className="mb-8 animate-fade-in hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl">Research Methodology</CardTitle>
              <CardDescription className="text-base">
                Our research combines quantitative and qualitative methods to understand how AR technology impacts reading behaviors and outcomes among youth aged 10-25. We partner with educational institutions, libraries, and literacy organizations to conduct controlled studies and gather real-world data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Longitudinal studies tracking reading habits over time</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Comparative analysis between traditional and AR-enhanced reading</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Cognitive assessment to measure comprehension and retention</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>User experience surveys and feedback collection</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Key Findings */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold mb-12 text-center">Key Findings</h2>
          
          <Card className="mb-8 animate-fade-in hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl">Research Outcomes</CardTitle>
              <CardDescription className="text-base">
                Our preliminary research has yielded promising results that support the effectiveness of AR-enhanced reading experiences in increasing engagement and improving comprehension among young readers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <TrendingUp className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">67% increase</p>
                    <p className="text-sm text-muted-foreground">in voluntary reading time among test subjects</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <BookOpen className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">42% improvement</p>
                    <p className="text-sm text-muted-foreground">in story comprehension and retention</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <Award className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">89% of participants</p>
                    <p className="text-sm text-muted-foreground">reported increased enjoyment of reading</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <Users className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Significant improvements</p>
                    <p className="text-sm text-muted-foreground">in vocabulary acquisition and retention</p>
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
          <h2 className="text-4xl font-bold mb-6">Participate in Our Research</h2>
          <p className="text-xl text-muted-foreground mb-8">
            We're always looking for schools, libraries, and individual readers to participate in our ongoing studies.
          </p>
          <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl animate-glow">
            Get Involved
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center text-muted-foreground">
            <p className="mb-4 font-semibold text-foreground">AR Storytelling Platform</p>
            <p className="text-sm mb-4">Reviving the joy of reading among youth through immersive AR experiences and gamified storytelling.</p>
            <p className="text-sm">© 2024 AR Storytelling. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Research;
