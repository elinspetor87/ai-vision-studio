import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Play, X, ExternalLink, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { videoService } from '@/services/videoService';
import { VideoProject } from '@/types';

const VideoSection = () => {
  const { data: videos, isLoading, error } = useQuery({
    queryKey: ['videos'],
    queryFn: () => videoService.getAllVideos(),
  });

  // Mostra loading
  if (isLoading) {
    return (
      <section id="work" className="relative py-32 bg-hero-gradient overflow-hidden">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  // Se houver erro ou não houver vídeos, não mostra a seção
  if (error || !videos || videos.length === 0) {
    return null;
  }

  return <VideoSectionContent videos={videos} />;
};

const VideoSectionContent = ({ videos }: { videos: VideoProject[] }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<VideoProject | null>(null);
  const [mainVideoPlaying, setMainVideoPlaying] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const mainVideoRef = useRef<HTMLIFrameElement>(null);

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

  const featuredVideo = videos?.find(v => v.featured) || videos?.[0];
  const otherVideos = videos?.filter(v => v._id !== featuredVideo?._id) || [];

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <section 
      id="work" 
      ref={sectionRef}
      className="relative py-32 bg-hero-gradient overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}>
          <p className="font-body text-sm tracking-[0.2em] uppercase text-primary mb-4">
            Featured Work
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Showreel <span className="text-gradient">2024</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            A collection of my most impactful AI-generated films and VFX work, 
            showcasing the fusion of traditional craft and emerging technology.
          </p>
        </div>

        {/* Main video player */}
        {featuredVideo && (
          <div className={`relative max-w-5xl mx-auto ${isVisible ? 'animate-fade-up delay-200' : 'opacity-0'}`}>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-card border border-border shadow-[0_25px_80px_-12px_hsl(0_0%_0%/0.7)]">
              {!mainVideoPlaying ? (
                /* Video thumbnail with play button overlay */
                <div
                  className="absolute inset-0 cursor-pointer group"
                  onClick={() => setMainVideoPlaying(true)}
                >
                  <img
                    src={featuredVideo.thumbnail.url}
                    alt={featuredVideo.thumbnail.alt || featuredVideo.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-background/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/30 mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 animate-pulse-glow">
                        <Play className="w-10 h-10 text-primary ml-1" />
                      </div>
                      <p className="font-body text-sm text-foreground font-medium">{featuredVideo.title}</p>
                      <p className="font-body text-xs text-muted-foreground">{featuredVideo.category} • {featuredVideo.year}</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* YouTube iframe player */
                <iframe
                  ref={mainVideoRef}
                  src={getYouTubeEmbedUrl(featuredVideo.videoUrl) + '?autoplay=1'}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            {/* Decorative frame */}
            <div className="absolute -inset-4 border border-primary/20 rounded-3xl -z-10" />
            <div className="absolute -inset-8 border border-primary/10 rounded-3xl -z-20" />
          </div>
        )}

        {/* Projects Grid */}
        {otherVideos.length > 0 && (
          <div className={`mt-20 ${isVisible ? 'animate-fade-up delay-400' : 'opacity-0'}`}>
            <h3 className="font-display text-2xl font-semibold text-center mb-10">
              Other <span className="text-primary">Projects</span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {otherVideos.map((project) => (
                <div
                  key={project._id}
                  onClick={() => setSelectedProject(project)}
                  className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-card border border-border cursor-pointer hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Thumbnail */}
                  <img
                    src={project.thumbnail.url}
                    alt={project.thumbnail.alt || project.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-background via-background/50 to-transparent">
                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="inline-block px-2 py-1 text-xs font-body bg-primary/20 text-primary rounded mb-2">
                        {project.category}
                      </span>
                      <h4 className="font-display text-lg font-semibold text-foreground mb-1">
                        {project.title}
                      </h4>
                      <p className="font-body text-sm text-muted-foreground">
                        {project.year}
                      </p>
                    </div>
                  </div>

                  {/* View icon */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <ExternalLink className="w-4 h-4 text-primary" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Project Detail Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="sm:max-w-3xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {selectedProject?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedProject && (
            <div className="space-y-4 pt-4">
              {/* Video Player */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                <iframe
                  src={getYouTubeEmbedUrl(selectedProject.videoUrl)}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="flex gap-3">
                <span className="px-3 py-1 text-sm font-body bg-primary/20 text-primary rounded">
                  {selectedProject.category}
                </span>
                <span className="px-3 py-1 text-sm font-body bg-secondary text-muted-foreground rounded">
                  {selectedProject.year}
                </span>
              </div>

              <p className="font-body text-muted-foreground leading-relaxed">
                {selectedProject.description}
              </p>

              <div className="pt-2 border-t border-border">
                <p className="font-body text-sm">
                  <span className="text-muted-foreground">Role:</span>{' '}
                  <span className="text-foreground font-medium">{selectedProject.role}</span>
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default VideoSection;
