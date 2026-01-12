import { useEffect, useState } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { settingsService } from '@/services/settingsService';
import AnimatedText from './animations/AnimatedText';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Fetch settings for hero section
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.getSettings(),
    staleTime: 10000,
  });

  if (isLoading) {
    return (
      <section className="relative min-h-screen flex flex-col gap-4 items-center justify-center overflow-hidden bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading experience...</p>
      </section>
    );
  }

  // Default values if settings not loaded
  const heroData = settings?.heroSection || {
    line1: 'Crafting',
    line2: 'Visual Stories',
    line3: 'with AI',
    tagline: 'AI Filmmaker & VFX Artist',
    description: 'Blending decades of VFX expertise with cutting-edge AI technology to create cinematic experiences that push the boundaries of imagination.',
    animation: {
      animationType: 'fadeSlide' as const,
      speed: 800,
      delay: 100,
      typewriterCursor: true,
      glitchIntensity: 5,
    },
  };

  useEffect(() => {
    if (!isLoading) {
      // Small delay to ensure render phase is done
      const timer = setTimeout(() => {
        setIsVisible(true);
        console.log('✨ Hero Section Visible. Data:', heroData);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient film-grain">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float delay-300" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {/* Tagline */}
          <p
            className={`font-body text-sm md:text-base tracking-[0.3em] uppercase text-primary mb-6 ${isVisible ? 'animate-fade-up' : ''
              }`}
          >
            {heroData.tagline}
          </p>

          {/* Main Title with Animated Text */}
          <h1
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
          >
            {isVisible && (
              <>
                <AnimatedText
                  text={heroData.line1}
                  animationType={heroData.animation.animationType}
                  speed={heroData.animation.speed}
                  delay={heroData.animation.delay}
                  typewriterCursor={heroData.animation.typewriterCursor}
                  glitchIntensity={heroData.animation.glitchIntensity}
                  lineNumber={0}
                  className="block"
                />
                <AnimatedText
                  text={heroData.line2}
                  animationType={heroData.animation.animationType}
                  speed={heroData.animation.speed}
                  delay={heroData.animation.delay}
                  typewriterCursor={heroData.animation.typewriterCursor}
                  glitchIntensity={heroData.animation.glitchIntensity}
                  lineNumber={1}
                  className="block text-gradient"
                />
                <AnimatedText
                  text={heroData.line3}
                  animationType={heroData.animation.animationType}
                  speed={heroData.animation.speed}
                  delay={heroData.animation.delay}
                  typewriterCursor={heroData.animation.typewriterCursor}
                  glitchIntensity={heroData.animation.glitchIntensity}
                  lineNumber={2}
                  className="block text-foreground/80"
                />
              </>
            )}
          </h1>

          {/* Description */}
          <p
            className={`font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 ${isVisible ? 'animate-fade-up delay-400' : ''
              }`}
          >
            {heroData.description}
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center ${isVisible ? 'animate-fade-up delay-500' : ''
              }`}
          >
            <a
              href="#work"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-body font-medium tracking-wide rounded-full transition-all duration-300 hover:shadow-[0_0_40px_hsl(38_92%_55%/0.4)] hover:scale-105"
            >
              <Play className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              View Showreel
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 px-8 py-4 border border-border text-foreground font-body font-medium tracking-wide rounded-full transition-all duration-300 hover:bg-secondary hover:border-primary/50"
            >
              Get in Touch
            </a>
          </div>
        </div>


      </div>

      {/* Film strip decoration */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent opacity-50" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent opacity-50" />
    </section>
  );
};

export default HeroSection;
