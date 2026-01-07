import { useState, useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  char: string;
  velocity: { x: number; y: number };
  opacity: number;
  size: number;
  type: 'explode' | 'float';
  floatPhase: number;
}

interface DustTextProps {
  children: string;
  className?: string;
  speedMultiplier?: number;
}

const DustText = ({ children, className = '', speedMultiplier = 1 }: DustTextProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [mouseVelocity, setMouseVelocity] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!textRef.current) return;

    const chars = children.split('');
    const containerRect = textRef.current.getBoundingClientRect();
    
    // Create particles for each character
    const newParticles: Particle[] = [];
    let currentX = 0;

    chars.forEach((char) => {
      // Create a temporary span to measure character width
      const tempSpan = document.createElement('span');
      tempSpan.style.font = window.getComputedStyle(textRef.current!).font;
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.position = 'absolute';
      tempSpan.textContent = char;
      document.body.appendChild(tempSpan);
      const charWidth = tempSpan.getBoundingClientRect().width;
      document.body.removeChild(tempSpan);

      // Add multiple dust particles per character
      for (let i = 0; i < 40; i++) {
        const isFloating = Math.random() > 0.6; // 40% float, 60% explode
        newParticles.push({
          x: currentX + Math.random() * charWidth,
          y: Math.random() * 30 - 15,
          originalX: currentX + charWidth / 2,
          originalY: 0,
          char: Math.random() > 0.3 ? '•' : '✦',
          velocity: isFloating
            ? {
                x: (Math.random() - 0.5) * 3,
                y: (Math.random() - 0.5) * 2,
              }
            : {
                x: (Math.random() - 0.5) * 15 * speedMultiplier,
                y: (Math.random() - 0.5) * 12 * speedMultiplier - 3,
              },
          opacity: 1,
          size: Math.random() * 1.5 + 0.3,
          type: isFloating ? 'float' : 'explode',
          floatPhase: Math.random() * Math.PI * 2,
        });
      }
      currentX += charWidth;
    });

    setParticles(newParticles);
  }, [children]);

  // Track mouse position and velocity globally when hovered
  useEffect(() => {
    if (!isHovered) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const newPos = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
        
        // Calculate mouse velocity (wind direction and strength)
        if (lastMousePos.current) {
          setMouseVelocity({
            x: (newPos.x - lastMousePos.current.x) * 0.5,
            y: (newPos.y - lastMousePos.current.y) * 0.5,
          });
        }
        
        lastMousePos.current = newPos;
        setMousePos(newPos);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      lastMousePos.current = null;
    };
  }, [isHovered]);

  useEffect(() => {
    if (!isHovered) {
      // Reset particles when not hovered
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: p.originalX,
          y: p.originalY,
          opacity: 1,
          floatPhase: Math.random() * Math.PI * 2,
        }))
      );
      setMousePos(null);
      return;
    }

    let frameCount = 0;
    
    const animate = () => {
      frameCount++;
      setParticles((prev) =>
        prev.map((p) => {
          if (p.type === 'float') {
            // Floating particles oscillate gently and stay visible
            const newPhase = p.floatPhase + 0.05;
            return {
              ...p,
              x: p.x + Math.sin(newPhase) * 0.8 + p.velocity.x * 0.3,
              y: p.y + Math.cos(newPhase * 0.7) * 0.5 + p.velocity.y * 0.2,
              floatPhase: newPhase,
              opacity: 0.6 + Math.sin(newPhase * 2) * 0.3, // Pulsing opacity
            };
          } else {
            // Exploding particles fly randomly then fall slowly
            const newPhase = p.floatPhase + 0.03;
            // Add randomness to velocity over time for chaotic movement
            const randomDrift = {
              x: Math.sin(newPhase * 2) * 0.5 + (Math.random() - 0.5) * 0.3,
              y: Math.cos(newPhase * 1.5) * 0.4 + (Math.random() - 0.5) * 0.3,
            };
            // Gravity effect - increases over time
            const gravity = Math.min(newPhase * 0.15, 1.5);
            // Slow down horizontal movement over time
            const horizontalDamping = Math.max(0.1, 1 - newPhase * 0.02);

            // Wind effect - mouse movement blows particles away
            let windForce = { x: 0, y: 0 };
            if (mousePos) {
              const dx = p.x - mousePos.x;
              const dy = p.y - mousePos.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const influenceRadius = 150; // Larger radius for wind effect
              
              if (distance < influenceRadius && distance > 0) {
                const distanceFactor = (influenceRadius - distance) / influenceRadius;
                
                // Wind blows in the direction of mouse movement
                const windStrength = Math.sqrt(mouseVelocity.x ** 2 + mouseVelocity.y ** 2);
                const windEffect = Math.min(windStrength * 0.8, 8) * distanceFactor;
                
                // Push away from cursor + follow wind direction
                const pushAway = {
                  x: (dx / distance) * distanceFactor * 4,
                  y: (dy / distance) * distanceFactor * 4,
                };
                
                windForce = {
                  x: pushAway.x + mouseVelocity.x * distanceFactor * 1.5,
                  y: pushAway.y + mouseVelocity.y * distanceFactor * 1.5,
                };
              }
            }

            return {
              ...p,
              x: p.x + (p.velocity.x * 0.4 + randomDrift.x) * horizontalDamping + windForce.x,
              y: p.y + p.velocity.y * 0.4 + randomDrift.y + gravity + windForce.y,
              floatPhase: newPhase,
              opacity: Math.max(0.15, p.opacity - 0.003), // Very slow fade, minimum 0.15 opacity
            };
          }
        })
      );
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered, mousePos]);

  return (
    <div
      ref={containerRef}
      className="relative inline-block cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Original text */}
      <span
        ref={textRef}
        className={`transition-all duration-500 ${className} ${
          isHovered ? 'opacity-0 blur-sm' : 'opacity-100'
        }`}
      >
        {children}
      </span>

      {/* Dust particles overlay */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {particles.map((particle, index) => (
            <span
              key={index}
              className="absolute text-primary"
              style={{
                left: particle.x,
                top: `calc(50% + ${particle.y}px)`,
                opacity: particle.opacity,
                fontSize: `${particle.size * 4}px`,
                transform: 'translate(-50%, -50%)',
                transition: 'none',
              }}
            >
              {particle.char}
            </span>
          ))}
        </div>
      )}

      {/* Glowing dust trail */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default DustText;
