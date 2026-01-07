import { Film, Heart, Mail, Linkedin, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Youtube, label: 'YouTube', href: '#' },
  ];

  return (
    <footer className="relative py-12 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <Film className="w-6 h-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
            <span className="font-display text-lg font-semibold tracking-wide">FILMMAKER</span>
          </a>

          {/* Contact Info */}
          <div className="flex items-center gap-6">
            <a
              href="mailto:hello@aifilmmaker.com"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <Mail className="w-4 h-4" />
              <span className="font-body text-sm">hello@aifilmmaker.com</span>
            </a>
            
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <p className="font-body text-sm text-muted-foreground flex items-center gap-1">
            © {new Date().getFullYear()} Crafted with 
            <Heart className="w-4 h-4 text-primary" /> 
            and imagination.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
