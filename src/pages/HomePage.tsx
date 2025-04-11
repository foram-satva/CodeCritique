
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Code2, FileCode, Rocket, Shield, Zap, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getHomepageData, getFeatures, getProcessSteps } from "@/services/homepage-service";
import { useToast } from "@/hooks/use-toast";

// Map of icon names to icon components
const iconMap = {
  Zap: Zap,
  Shield: Shield,
  Rocket: Rocket,
  FileCode: FileCode,
  Code2: Code2,
};

const HomePage = () => {
  const { toast } = useToast();
  
  const { data: homepageData, isLoading: isLoadingHomepage } = useQuery({
    queryKey: ['homepageData'],
    queryFn: getHomepageData,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to load homepage data",
          variant: "destructive",
        });
      }
    }
  });

  const { data: features, isLoading: isLoadingFeatures } = useQuery({
    queryKey: ['features'],
    queryFn: getFeatures,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to load features",
          variant: "destructive",
        });
      }
    }
  });

  const { data: processSteps, isLoading: isLoadingSteps } = useQuery({
    queryKey: ['processSteps'],
    queryFn: getProcessSteps,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to load process steps",
          variant: "destructive",
        });
      }
    }
  });

  const isLoading = isLoadingHomepage || isLoadingFeatures || isLoadingSteps;

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navbar */}
      <header className="border-b bg-card">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CodeCritique</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm hover:text-primary transition-colors">How It Works</a>
            <a href="#faq" className="text-sm hover:text-primary transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline" size="sm">Log in</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          {isLoadingHomepage ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  {homepageData?.hero_title || "CodeCritique - AI Code Analysis for Any Language"}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {homepageData?.hero_description || "Analyze your code in any programming language with AI-powered insights"}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started for Free
                    </Button>
                  </Link>
                  <a href="#how-it-works">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Learn More
                    </Button>
                  </a>
                </div>
              </div>
              <div className="bg-card rounded-lg shadow-lg p-6 border">
                <div className="h-60 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center p-4">
                    <FileCode className="h-16 w-16 mx-auto text-primary-purple mb-4" />
                    <p className="text-sm text-muted-foreground">Code visualization and analysis for multiple languages</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-accent/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Powerful Features</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered code review system offers comprehensive analysis and optimization for your code in any programming language.
            </p>
          </div>

          {isLoadingFeatures ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {features?.map((feature) => {
                const IconComponent = iconMap[feature.icon_name as keyof typeof iconMap] || Zap;
                return (
                  <div key={feature.id} className="bg-card p-6 rounded-lg shadow-sm border">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              CodeCritique makes code reviewing simple and efficient with just a few steps.
            </p>
          </div>

          {isLoadingSteps ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {processSteps?.map((step) => (
                <div key={step.id} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-foreground font-bold">{step.step_number}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Improve Your Code?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join CodeCritique today and take your code quality to the next level with AI-powered insights and recommendations.
          </p>
          <Link to="/register">
            <Button size="lg">Get Started Now</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Code2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">CodeCritique</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} CodeCritique. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
