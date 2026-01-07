import { useEffect, useRef, useState } from 'react';
import { Film, Award, Users, Sparkles } from 'lucide-react';

const QuoteShowcaseSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const showcases = [
    { icon: Film, value: '50+', label: 'Projects Completed' },
    { icon: Award, value: '15', label: 'Years Experience' },
    { icon: Users, value: '30+', label: 'Happy Clients' },
    { icon: Sparkles, value: '100K+', label: 'AI Renders' },
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-secondary/20 overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      
      <div className="container mx-auto px-6">
        <div className={`grid md:grid-cols-2 gap-12 lg:gap-20 items-center ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}>
          
          {/* Image Side */}
          <div className="relative">
            <div className="relative aspect-[4/5] max-w-md mx-auto">
              {/* Decorative frame */}
              <div className="absolute inset-0 border border-primary/30 rounded-sm translate-x-4 translate-y-4" />
              
              {/* Image placeholder - replace with actual image */}
              <div className="relative w-full h-full bg-gradient-to-br from-secondary to-background rounded-sm overflow-hidden border border-border">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Film className="w-16 h-16 mx-auto mb-4 text-primary/50" />
                    <p className="font-body text-sm">Your photo here</p>
                  </div>
                </div>
              </div>
              
              {/* Accent corner */}
              <div className="absolute -bottom-2 -left-2 w-20 h-20 border-l-2 border-b-2 border-primary" />
            </div>
          </div>

          {/* Quote & Showcases Side */}
          <div className="space-y-10">
            {/* Quote */}
            <blockquote className="relative">
              <span className="absolute -top-8 -left-4 font-display text-8xl text-primary/20">"</span>
              <p className="font-display text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed text-foreground">
                AI will not make better artists, 
                <span className="text-primary"> artists will make better work with AI.</span>
              </p>
              <span className="absolute -bottom-12 right-0 font-display text-8xl text-primary/20">"</span>
            </blockquote>

            <p className="font-body text-muted-foreground leading-relaxed pt-4">
              Embracing technology as a creative partner, not a replacement. 
              The future of filmmaking is a collaboration between human vision and artificial intelligence.
            </p>

            {/* Showcases Grid */}
            <div className="grid grid-cols-2 gap-6 pt-6">
              {showcases.map((item, index) => (
                <div 
                  key={item.label}
                  className="group p-5 bg-background/50 border border-border/50 rounded-lg hover:border-primary/50 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <item.icon className="w-5 h-5 text-primary mb-3" />
                  <p className="font-display text-3xl font-bold text-foreground mb-1">
                    {item.value}
                  </p>
                  <p className="font-body text-sm text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteShowcaseSection;