import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { videoService } from '@/services/videoService';
import { Loader2, Plus, Edit, Trash2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const VideosManagement = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: videos, isLoading } = useQuery({
    queryKey: ['videos-admin'],
    queryFn: () => videoService.getAllVideos('all'),
  });

  // Delete video mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => videoService.deleteVideo(id),
    onSuccess: () => {
      toast.success('Video deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['videos-admin'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete video');
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Videos</h1>
          <p className="font-body text-muted-foreground">
            Manage your video projects and showreels
          </p>
        </div>

        <Button className="gap-2" onClick={() => navigate('/admin/videos/add')}>
          <Plus className="w-4 h-4" />
          Add Video
        </Button>
      </div>

      {/* Videos Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : !videos || videos.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-xl">
          <p className="font-body text-muted-foreground mb-4">No videos yet</p>
          <Button className="gap-2" onClick={() => navigate('/admin/videos/add')}>
            <Plus className="w-4 h-4" />
            Add your first video
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors group"
            >
              <div className="relative aspect-video">
                <img
                  src={video.thumbnail.url}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="p-3 bg-primary rounded-full">
                    <Play className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="w-8 h-8"
                    onClick={() => navigate(`/admin/videos/edit/${video._id}`)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="w-8 h-8 text-red-500"
                    onClick={() => handleDelete(video._id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-body font-semibold text-lg mb-1">{video.title}</h3>
                <p className="font-body text-sm text-muted-foreground mb-2">
                  {video.role} • {video.year}
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-secondary rounded text-xs">{video.category}</span>
                  {video.featured && (
                    <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideosManagement;
