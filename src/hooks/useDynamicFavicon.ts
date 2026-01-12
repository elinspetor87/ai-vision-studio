import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { settingsService } from '@/services/settingsService';

export const useDynamicFavicon = () => {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.getSettings(),
    staleTime: 60000, // Cache for 1 minute
  });

  useEffect(() => {
    if (settings?.favicon?.url) {
      // Find existing favicon link elements
      const existingFavicons = document.querySelectorAll(
        "link[rel='icon'], link[rel='shortcut icon']"
      );

      // Remove existing favicons
      existingFavicons.forEach((favicon) => favicon.remove());

      // Create new favicon link element
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/x-icon';
      link.href = settings.favicon.url;

      // Add to head
      document.head.appendChild(link);
    }
  }, [settings?.favicon?.url]);

  return settings?.favicon;
};
