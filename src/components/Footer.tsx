import { useEffect } from 'react';
import { Film, Heart, Mail, Linkedin, Instagram, Youtube, Twitter, Facebook, Link as LinkIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { settingsService } from '@/services/settingsService';
import { socialMediaService } from '@/services/socialMediaService';

// Map platform names to Lucide icons
const iconMap: Record<string, any> = {
  LinkedIn: Linkedin,
  Instagram: Instagram,
  YouTube: Youtube,
  Twitter: Twitter,
  Facebook: Facebook,
  TikTok: LinkIcon,
  Vimeo: LinkIcon,
  Behance: LinkIcon,
  ArtStation: LinkIcon,
  IMDB: LinkIcon,
  Website: LinkIcon,
  Other: LinkIcon,
};

const Footer = () => {
  // Fetch settings for logo
  const { data: settings, refetch: refetchSettings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      console.log('🔄 Footer fetching settings...');
      const data = await settingsService.getSettings();
      console.log('📦 Footer received settings:', {
        logoText: data.logoText,
        contactEmail: data.contactEmail,
        logo: data.logo?.url,
      });
      return data;
    },
    staleTime: 10000, // 10 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Debug: Log settings when they change
  useEffect(() => {
    if (settings) {
      console.log('✅ Footer using settings:', {
        logoText: settings.logoText,
        contactEmail: settings.contactEmail,
        logo: settings.logo?.url,
      });
    }
  }, [settings]);

  // Expose refetch function globally for testing
  useEffect(() => {
    (window as any).refetchFooterSettings = refetchSettings;
    console.log('💡 You can manually refresh footer: window.refetchFooterSettings()');
  }, [refetchSettings]);

  // Fetch social media links
  const { data: socialLinks = [] } = useQuery({
    queryKey: ['socialMedia', 'public'],
    queryFn: () => socialMediaService.getPublicLinks(),
    staleTime: 30000, // 30 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return (
    <footer className="relative py-12 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            {settings?.logo?.url ? (
              <img
                src={settings.logo.url}
                alt={settings.logo.alt || 'Logo'}
                className="w-6 h-6 object-contain transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <Film className="w-6 h-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
            )}
            <span className="font-display text-lg font-semibold tracking-wide">
              {settings?.logoText || 'FELIPE ALMEIDA'}
            </span>
          </a>

          {/* Contact Info */}
          <div className="flex items-center gap-6">
            <a
              href={`mailto:${settings?.contactEmail || 'getintouch@felipealmeida.studio'}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <Mail className="w-4 h-4" />
              <span className="font-body text-sm">{settings?.contactEmail || 'getintouch@felipealmeida.studio'}</span>
            </a>

            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const IconComponent = iconMap[social.platform] || LinkIcon;
                  return (
                    <a
                      key={social._id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors duration-300"
                      aria-label={social.platform}
                      title={social.username}
                    >
                      <IconComponent className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            )}
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
