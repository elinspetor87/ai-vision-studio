import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/services/projectService';
import { Project } from '@/types';
import { Loader2 } from 'lucide-react';
import ProjectModal from './ProjectModal';

const ProjectsSection = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getAllProjects('active'),
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <>
      <section id="projects" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Projects
            </h2>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore my portfolio of creative projects blending AI and filmmaking
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => setSelectedProject(project)}
                className="group cursor-pointer relative overflow-hidden rounded-xl bg-card border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={project.thumbnail.url}
                    alt={project.thumbnail.alt || project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Play icon overlay */}
                  {project.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                        <svg className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-primary mb-2">
                    <span>{project.category}</span>
                    <span>•</span>
                    <span>{project.year}</span>
                  </div>

                  <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>

                  <p className="font-body text-sm text-muted-foreground mb-3 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="text-xs text-muted-foreground">
                    <span className="font-semibold">Role:</span> {project.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
};

export default ProjectsSection;
