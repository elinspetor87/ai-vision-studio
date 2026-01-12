import { useEffect, useRef, useState } from 'react';
import { Sparkles, Layers, Film, Wand2, LucideIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { settingsService } from '@/services/settingsService';

// Map icon names to Lucide icon components
const iconMap: Record<string, LucideIcon> = {
  Layers,
  Film,
  Wand2,
  Sparkles,
};

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Fetch settings
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.getSettings(),
    staleTime: 10000, // 10 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Use settings data or fallback to defaults
  const aboutData = settings?.aboutSection || {
    sectionTitle: 'The Journey',
    heading: 'From VFX Pioneer to',
    headingHighlight: 'AI Visionary',
    paragraph1: "With over 15 years in visual effects, I've had the privilege of working on blockbuster films that have captivated audiences worldwide. From intricate compositing work to leading VFX teams, my journey has been defined by an relentless pursuit of visual excellence.",
    paragraph2: "Today, I'm pioneering the integration of AI into filmmaking—leveraging tools like Midjourney, Runway, and Sora to create imagery that was once impossible. My VFX background gives me a unique edge: I understand both the art and the technique.",
    stats: {
      filmsShows: '50+',
      yearsExp: '15+',
    },
    skills: [
      { icon: 'Layers', label: 'VFX Compositing', years: '15+ years' },
      { icon: 'Film', label: 'Motion Graphics', years: '12+ years' },
      { icon: 'Wand2', label: 'AI Generation', years: '3+ years' },
      { icon: 'Sparkles', label: 'Video Editing', years: '10+ years' },
    ],
    tools: ['Nuke', 'After Effects', 'Houdini', 'Runway', 'Midjourney', 'Sora', 'ComfyUI', 'DaVinci'],
  };

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

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="relative py-32 bg-background overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className={`space-y-8 ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}>
            <div>
              <p className="font-body text-sm tracking-[0.2em] uppercase text-primary mb-4">
                {aboutData.sectionTitle}
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6">
                {aboutData.heading}
                <span className="text-gradient block">{aboutData.headingHighlight}</span>
              </h2>
            </div>

            <div className="space-y-6 font-body text-muted-foreground leading-relaxed">
              <p>{aboutData.paragraph1}</p>
              <p>{aboutData.paragraph2}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border">
              <div>
                <p className="font-display text-3xl md:text-4xl font-bold text-gradient">{aboutData.stats.filmsShows}</p>
                <p className="font-body text-sm text-muted-foreground mt-1">Films & Shows</p>
              </div>
              <div>
                <p className="font-display text-3xl md:text-4xl font-bold text-gradient">{aboutData.stats.yearsExp}</p>
                <p className="font-body text-sm text-muted-foreground mt-1">Years Exp</p>
              </div>
            </div>
          </div>

          {/* Right content - Skills */}
          <div className={`${isVisible ? 'animate-fade-up delay-300' : 'opacity-0'}`}>
            <div className="grid grid-cols-2 gap-4">
              {aboutData.skills.map((skill, index) => {
                const IconComponent = iconMap[skill.icon] || Layers;
                return (
                  <div
                    key={skill.label}
                    className="group relative p-6 bg-card-gradient rounded-2xl border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_hsl(38_92%_55%/0.1)]"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                    <IconComponent className="w-10 h-10 text-primary mb-4 transition-transform duration-300 group-hover:scale-110" />
                    <h3 className="font-display text-lg font-semibold mb-1">{skill.label}</h3>
                    <p className="font-body text-sm text-muted-foreground">{skill.years}</p>
                  </div>
                );
              })}
            </div>

            {/* Software/Tools */}
            <div className="mt-8 p-6 bg-secondary/30 rounded-2xl border border-border">
              <p className="font-body text-sm text-muted-foreground mb-4">Tools & Technologies</p>
              <div className="flex flex-wrap gap-2">
                {aboutData.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-4 py-2 bg-background rounded-full font-body text-sm border border-border hover:border-primary/50 hover:text-primary transition-all duration-300 cursor-default"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
