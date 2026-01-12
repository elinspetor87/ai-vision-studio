import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Menu, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { settingsService } from '@/services/settingsService';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Fetch settings for logo
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.getSettings(),
    staleTime: 10000, // 10 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#work', label: 'Work' },
    { href: '#gallery', label: 'Gallery' },
    { href: '/blog', label: 'Blog', isRoute: true },
    { href: '#schedule', label: 'Contact' },
  ];

  const isHomePage = location.pathname === '/';

  const handleNavClick = (href: string, isRoute?: boolean) => {
    if (isRoute) return; // Let Link handle it
    
    if (!isHomePage && href.startsWith('#')) {
      // Navigate to home page with hash
      window.location.href = '/' + href;
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-background/90 backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            {settings?.logo?.url ? (
              <img
                src={settings.logo.url}
                alt={settings.logo.alt || 'Logo'}
                className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <Film className="w-8 h-8 text-primary transition-transform duration-300 group-hover:rotate-12" />
            )}
            <span className="font-display text-xl font-semibold tracking-wide">
              {settings?.logoText || 'FILMMAKER'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="relative font-body text-sm tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={isHomePage ? link.href : '/' + link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="relative font-body text-sm tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.label}
                </a>
              )
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border animate-fade-in">
            <div className="flex flex-col py-4">
              {navLinks.map((link) => (
                link.isRoute ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-6 py-3 font-body text-sm tracking-wider uppercase text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={isHomePage ? link.href : '/' + link.href}
                    onClick={() => {
                      handleNavClick(link.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-6 py-3 font-body text-sm tracking-wider uppercase text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-all duration-300"
                  >
                    {link.label}
                  </a>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
