
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, Code2 } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import { useQuery } from "@tanstack/react-query";
import { getHomepageData } from "@/services/homepage-service";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  // Fetch homepage data
  const { data: homepageData } = useQuery({
    queryKey: ['indexHomepageData'],
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

  const heroTitle = homepageData?.hero_title || "Welcome to CodeCritique";
  const heroDescription = homepageData?.hero_description || "Your AI-powered platform for code review and analysis in any language";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sage to-dark-green dark:from-charcoal dark:to-dark-green">
      <div className="absolute top-4 right-4">
        <Toggle 
          pressed={theme === "dark"}
          onPressedChange={toggleTheme}
          aria-label="Toggle dark mode"
          className="bg-cream/20 backdrop-blur-sm hover:bg-cream/30 dark:bg-charcoal/60 dark:hover:bg-charcoal/80"
        >
          {theme === "dark" ? <Sun className="h-5 w-5 text-cream" /> : <Moon className="h-5 w-5 text-dark-green" />}
        </Toggle>
      </div>
      
      <div className="max-w-3xl mx-auto text-center px-4">
        <div className="bg-cream/10 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-cream/20 dark:bg-dark-green/30 dark:border-charcoal/40">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-primary p-4 rounded-full">
              <Code2 className="h-16 w-16 text-cream dark:text-cream" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-cream dark:text-cream">{heroTitle}</h1>
          <p className="text-xl text-cream/80 dark:text-cream/70 mb-8">
            {heroDescription}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { color: "bg-cream dark:bg-cream/90", label: "Cream" },
              { color: "bg-sage dark:bg-sage/90", label: "Sage" },
              { color: "bg-charcoal dark:bg-charcoal/90", label: "Charcoal" },
              { color: "bg-dark-green dark:bg-dark-green/90", label: "Dark Green" },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`${item.color} w-16 h-16 rounded-md shadow-md mb-2`}></div>
                <span className="text-sm text-cream/80 dark:text-cream/70">{item.label}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate("/login")}
              className="bg-cream text-dark-green hover:bg-cream/80 dark:bg-cream/90 dark:hover:bg-cream/70"
            >
              Login
            </Button>
            <Button 
              onClick={() => navigate("/register")}
              className="bg-sage hover:bg-sage/80 text-cream dark:bg-sage/90 dark:hover:bg-sage/70"
            >
              Register
            </Button>
            <Button 
              onClick={() => navigate("/dashboard")}
              className="bg-charcoal hover:bg-charcoal/80 text-cream dark:bg-charcoal/90 dark:hover:bg-charcoal/70"
            >
              Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
