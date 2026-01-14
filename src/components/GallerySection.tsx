import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Play, ChevronLeft, ChevronRight, Star, Loader2 } from 'lucide-react';
import { filmService } from '@/services/filmService';

const GallerySection = () => {
  const { data: films, isLoading, error } = useQuery({
    queryKey: ['films'],
    queryFn: () => filmService.getAllFilms(),
  });

  if (isLoading) {
    return (
      <section id="gallery" className="relative py-32 bg-background overflow-hidden">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  // Se não houver filmes, não mostra a seção (mas não quebra a página)
  if (error || !films || films.length === 0) {
    return null;
  }

  return <GallerySectionContent films={films} />;
};

const GallerySectionContent = ({ films }: { films: any[] }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handlePrev = () => {
    if (!films || films.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? films.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (!films || films.length === 0) return;
    setCurrentIndex((prev) => (prev === films.length - 1 ? 0 : prev + 1));
  };

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(dragOffset) > 80) {
      if (dragOffset > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    setDragOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX);
  const handleMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX);
  const handleMouseUp = () => handleDragEnd();
  const handleMouseLeave = () => handleDragEnd();

  const handleTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX);
  const handleTouchEnd = () => handleDragEnd();

  const getCardStyle = (index: number) => {
    if (!films || films.length === 0) return { opacity: 0, transform: 'scale(0.6) translateX(0)', zIndex: 0, pointerEvents: 'none' as const };
    const diff = index - currentIndex;
    const normalizedDiff = ((diff + films.length) % films.length);
    const adjustedDiff = normalizedDiff > films.length / 2 ? normalizedDiff - films.length : normalizedDiff;

    // Show more cards in the deck (3 behind, current, 3 ahead)
    if (Math.abs(adjustedDiff) > 3) {
      return {
        opacity: 0,
        transform: 'scale(0.6) translateX(0)',
        zIndex: 0,
        pointerEvents: 'none' as const,
      };
    }

    // Enhanced deck positioning
    const baseOffset = adjustedDiff * 80;
    const dragInfluence = isDragging ? dragOffset * 0.4 : 0;
    const offset = baseOffset - dragInfluence;

    // More dramatic scaling for depth
    const scale = 1 - Math.abs(adjustedDiff) * 0.08;
    const opacity = adjustedDiff === 0 ? 1 : 0.85 - Math.abs(adjustedDiff) * 0.15;

    // Add slight random rotation jitter for natural deck feel
    const baseRotation = adjustedDiff * 3;
    const jitter = (index % 3 - 1) * 1.5; // Subtle variation based on index
    const rotate = baseRotation + jitter + (isDragging ? dragOffset * 0.015 : 0);

    // Stack cards with slight vertical offset
    const yOffset = Math.abs(adjustedDiff) * 15 + (adjustedDiff < 0 ? -5 : 5);
    const zIndex = 20 - Math.abs(adjustedDiff);

    return {
      opacity,
      transform: `translateX(${offset}px) translateY(${yOffset}px) scale(${scale}) rotate(${rotate}deg)`,
      zIndex,
      pointerEvents: adjustedDiff === 0 ? 'auto' as const : 'none' as const,
      filter: adjustedDiff === 0 ? 'none' : `brightness(${0.9 - Math.abs(adjustedDiff) * 0.05})`,
    };
  };

  const currentFilm = films && films.length > 0 ? films[currentIndex] : null;

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative py-32 bg-background overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute inset-0" style={{ background: 'var(--gradient-glow)' }} />

      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}>
          <p className="font-body text-sm tracking-[0.2em] uppercase text-primary mb-4">
            Filmography
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Films I've <span className="text-gradient">Shaped</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            From blockbuster VFX work to AI-generated short films,
            each project represents a step in the evolution of visual storytelling.
          </p>
        </div>

        {/* Stacked Cards Gallery */}
        <div className={`${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <div
            ref={containerRef}
            className="relative h-[500px] md:h-[550px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Card Stack */}
            {films.map((film, index) => (
              <div
                key={film._id}
                className="absolute w-64 md:w-72 transition-all duration-300 ease-out"
                style={getCardStyle(index)}
              >
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border-2 border-border bg-card shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5),0_10px_30px_-10px_rgba(0,0,0,0.4)] hover:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.6),0_15px_40px_-10px_rgba(0,0,0,0.5)] transition-shadow duration-300">
                  {/* Movie Poster */}
                  <img
                    src={film.image.url}
                    alt={film.image.alt || film.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    draggable={false}
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4">
                    {/* Top info */}
                    <div className="flex items-start justify-between">
                      <span className="px-2.5 py-1 bg-background/70 backdrop-blur-md rounded-full font-body text-xs font-medium text-foreground">
                        {film.category}
                      </span>
                      {film.rating && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-background/70 backdrop-blur-md rounded-md font-body text-xs font-bold text-primary">
                          <Star className="w-3 h-3 fill-primary" />
                          {film.rating}
                        </span>
                      )}
                    </div>

                    {/* Bottom info */}
                    <div>
                      <h3 className="font-display text-xl md:text-2xl font-bold mb-1 text-foreground drop-shadow-lg">
                        {film.title}
                      </h3>
                      <p className="font-body text-sm text-foreground/80">{film.role}</p>
                      <div className="flex items-center gap-2 mt-2 text-foreground/70">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="font-body text-xs font-medium">{film.year}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Film Details Panel */}
          {currentFilm && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-4 px-6 py-4 bg-card/50 backdrop-blur-sm rounded-2xl border border-border">
                {currentFilm.showreelUrl && (
                  <>
                    <a
                      href={currentFilm.showreelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-body text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      <Play className="w-4 h-4" />
                      <span>Watch Reel</span>
                    </a>
                    <div className="w-px h-8 bg-border" />
                  </>
                )}
                <div className="text-left">
                  <p className="font-display text-lg font-bold text-foreground">{currentFilm.title}</p>
                  <p className="font-body text-sm text-muted-foreground">{currentFilm.role} • {currentFilm.year}</p>
                </div>
              </div>
            </div>
          )}

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {films.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full ${index === currentIndex
                  ? 'w-8 h-2 bg-primary'
                  : 'w-2 h-2 bg-muted hover:bg-muted-foreground'
                  }`}
              />
            ))}
          </div>

          {/* Instructions */}
          <p className="text-center mt-6 font-body text-sm text-muted-foreground">
            Drag cards or use arrows to explore • Click dots to jump to a film
          </p>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
