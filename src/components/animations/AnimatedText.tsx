import { useState, useEffect, useMemo } from 'react';

interface AnimatedTextProps {
  text: string;
  animationType: 'fadeSlide' | 'typewriter' | 'rotateScale' | 'glitch';
  speed: number;
  delay: number;
  className?: string;
  typewriterCursor?: boolean;
  glitchIntensity?: number;
  lineNumber?: number;
}

const AnimatedText = ({
  text,
  animationType,
  speed,
  delay,
  className = '',
  typewriterCursor = true,
  glitchIntensity = 5,
  lineNumber = 0,
}: AnimatedTextProps) => {
  const [visibleChars, setVisibleChars] = useState(0);
  const [glitchingIndices, setGlitchingIndices] = useState<Set<number>>(new Set());
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Split text into words for word-level animations
  const words = useMemo(() => text.split(' '), [text]);

  // Split text into characters for character-level animations
  const chars = useMemo(() => text.split(''), [text]);

  // Typewriter effect
  useEffect(() => {
    if (animationType !== 'typewriter' || prefersReducedMotion) {
      setIsAnimationComplete(true);
      return;
    }

    // Calculate base delay based on line number to stagger lines
    const baseDelay = lineNumber * 800;

    let currentIndex = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        currentIndex++;
        setVisibleChars(currentIndex);

        if (currentIndex >= chars.length) {
          clearInterval(interval);
          setIsAnimationComplete(true);
        }
      }, delay);

      return () => clearInterval(interval);
    }, baseDelay);

    return () => clearTimeout(timer);
  }, [animationType, chars.length, delay, prefersReducedMotion, lineNumber]);

  // Glitch effect
  useEffect(() => {
    if (animationType !== 'glitch' || prefersReducedMotion) {
      setIsAnimationComplete(true);
      return;
    }

    // Calculate base delay based on line number
    const baseDelay = lineNumber * 600;

    let animationTimer: NodeJS.Timeout;
    let glitchTimer: NodeJS.Timeout;

    const startGlitching = () => {
      const glitchInterval = setInterval(() => {
        const numGlitching = Math.floor(Math.random() * glitchIntensity) + 1;
        const newGlitching = new Set<number>();

        for (let i = 0; i < numGlitching; i++) {
          const randomIndex = Math.floor(Math.random() * chars.length);
          newGlitching.add(randomIndex);
        }

        setGlitchingIndices(newGlitching);

        setTimeout(() => {
          setGlitchingIndices(new Set());
        }, 50);
      }, 150);

      // Stop glitching after animation completes
      glitchTimer = setTimeout(() => {
        clearInterval(glitchInterval);
        setIsAnimationComplete(true);
      }, chars.length * delay + 1000);

      return glitchInterval;
    };

    animationTimer = setTimeout(() => {
      const interval = startGlitching();
      return () => clearInterval(interval);
    }, baseDelay);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(glitchTimer);
    };
  }, [animationType, chars.length, delay, glitchIntensity, prefersReducedMotion, lineNumber]);

  // For CSS animations, mark as complete after duration
  useEffect(() => {
    if ((animationType === 'fadeSlide' || animationType === 'rotateScale') && !prefersReducedMotion) {
      const totalDuration = lineNumber * 400 + words.length * delay + speed;
      const timer = setTimeout(() => {
        setIsAnimationComplete(true);
      }, totalDuration);
      return () => clearTimeout(timer);
    }
  }, [animationType, words.length, delay, speed, prefersReducedMotion, lineNumber]);

  // If prefers reduced motion, show text immediately
  if (prefersReducedMotion) {
    return <span className={className}>{text}</span>;
  }

  // Fade & Slide Animation (word-level)
  if (animationType === 'fadeSlide') {
    // Check if gradient class is present - apply to individual words
    const hasGradient = className.includes('text-gradient');
    const baseClasses = className.replace('text-gradient', '').trim();

    return (
      <span className={baseClasses} aria-label={text}>
        {words.map((word, index) => (
          <span
            key={index}
            className={`inline-block opacity-0 animate-fade-slide ${hasGradient ? 'text-gradient' : ''}`}
            style={{
              animationDuration: `${speed}ms`,
              animationDelay: `${lineNumber * 400 + index * delay}ms`,
              animationFillMode: 'forwards',
            }}
          >
            {word}
            {index < words.length - 1 && '\u00A0'}
          </span>
        ))}
      </span>
    );
  }

  // Typewriter Animation (character-level)
  if (animationType === 'typewriter') {
    return (
      <span className={className} aria-label={text}>
        {chars.map((char, index) => (
          <span
            key={index}
            className={index < visibleChars ? 'inline' : 'hidden'}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
        {!isAnimationComplete && typewriterCursor && (
          <span className="inline-block w-0.5 h-[1em] bg-current ml-1 animate-cursor-blink" />
        )}
      </span>
    );
  }

  // Rotate & Scale Animation (word-level)
  if (animationType === 'rotateScale') {
    // Check if gradient class is present - apply to individual words
    const hasGradient = className.includes('text-gradient');
    const baseClasses = className.replace('text-gradient', '').trim();

    return (
      <span className={baseClasses} aria-label={text}>
        {words.map((word, index) => (
          <span
            key={index}
            className={`inline-block opacity-0 animate-rotate-scale ${hasGradient ? 'text-gradient' : ''}`}
            style={{
              animationDuration: `${speed}ms`,
              animationDelay: `${lineNumber * 400 + index * delay}ms`,
              animationFillMode: 'forwards',
              transformStyle: 'preserve-3d',
            }}
          >
            {word}
            {index < words.length - 1 && '\u00A0'}
          </span>
        ))}
      </span>
    );
  }

  // Glitch Animation (character-level)
  if (animationType === 'glitch') {
    return (
      <span className={className} aria-label={text}>
        {chars.map((char, index) => {
          const isGlitching = glitchingIndices.has(index);
          const glitchClass = isGlitching ? 'animate-glitch' : '';

          return (
            <span
              key={index}
              className={`inline-block transition-opacity duration-100 ${glitchClass}`}
              style={{
                opacity: index * delay < (Date.now() % 10000) || isAnimationComplete ? 1 : 0,
                animationDuration: '0.1s',
                ...(isGlitching && {
                  textShadow: `${Math.random() * 4 - 2}px 0 red, ${Math.random() * 4 - 2}px 0 blue`,
                }),
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          );
        })}
      </span>
    );
  }

  return <span className={className}>{text}</span>;
};

export default AnimatedText;
