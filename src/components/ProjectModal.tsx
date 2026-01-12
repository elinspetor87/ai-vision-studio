import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Project } from '@/types';
import { ExternalLink, Calendar, User, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  // Extract video ID from YouTube URL
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl font-bold pr-8">
            {project.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Video Player */}
          {project.videoUrl && (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
              <iframe
                src={getYouTubeEmbedUrl(project.videoUrl)}
                title={project.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Project Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Year</p>
                <p className="font-semibold">{project.year}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="font-semibold">{project.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 col-span-2">
              <User className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="font-semibold">{project.role}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <div>
              <h3 className="font-display text-xl font-semibold mb-3">About This Project</h3>
              <p className="font-body text-muted-foreground whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
          )}

          {/* Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <div>
              <h3 className="font-display text-xl font-semibold mb-4">Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.gallery.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer"
                  >
                    <img
                      src={image.url}
                      alt={image.alt || `${project.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-sm">View Full Size</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* External Links */}
          {project.links && project.links.length > 0 && (
            <div>
              <h3 className="font-display text-xl font-semibold mb-4">Links</h3>
              <div className="flex flex-wrap gap-3">
                {project.links.map((link, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    asChild
                    className="gap-2"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {link.label}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
