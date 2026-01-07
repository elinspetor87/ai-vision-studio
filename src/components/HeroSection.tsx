import { useEffect, useState } from 'react';
import { Play, ChevronDown } from 'lucide-react';
import DustText from './DustText';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
            className={`font-body text-sm md:text-base tracking-[0.3em] uppercase text-primary mb-6 ${
              isVisible ? 'animate-fade-up' : ''
            }`}
          >
            AI Filmmaker & VFX Artist
          </p>

          {/* Main Title with Dust Effect */}
          <h1 
            className={`font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 ${
              isVisible ? 'animate-fade-up delay-200' : ''
            }`}
          >
            <span className="block">
              <DustText>Crafting</DustText>
            </span>
            <span className="block text-gradient">
              <DustText className="text-gradient" speedMultiplier={4}>Visual Stories</DustText>
            </span>
            <span className="block text-foreground/80">
              <DustText className="text-foreground/80">with AI</DustText>
            </span>
          </h1>

          {/* Description */}
          <p 
            className={`font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 ${
              isVisible ? 'animate-fade-up delay-400' : ''
            }`}
          >
            Blending decades of VFX expertise with cutting-edge AI technology 
            to create cinematic experiences that push the boundaries of imagination.
          </p>

          {/* CTA Buttons */}
          <div 
            className={`flex flex-col sm:flex-row gap-4 justify-center ${
              isVisible ? 'animate-fade-up delay-500' : ''
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

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
            <ChevronDown className="w-8 h-8" />
          </a>
        </div>
      </div>

      {/* Film strip decoration */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent opacity-50" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent opacity-50" />
    </section>
  );
};

export default HeroSection;
