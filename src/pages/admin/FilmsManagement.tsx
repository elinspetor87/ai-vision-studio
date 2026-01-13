import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { filmService } from '@/services/filmService';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const FilmsManagement = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: films, isLoading } = useQuery({
    queryKey: ['films-admin'],
    queryFn: () => filmService.getAllFilms('all'),
  });

  // Delete film mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => filmService.deleteFilm(id),
    onSuccess: () => {
      toast.success('Film deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['films-admin'] });
      setDeletingId(null);
    },
    onError: (error: any) => {
      console.error('Delete error:', error);
      const errorMsg = error.response?.data?.message || 'Failed to delete film';
      toast.error(errorMsg);
      setDeletingId(null);
    },
  });

  const handleDelete = (id: string) => {
    console.log('🗑️ Delete clicked for film ID:', id);
    setDeletingId(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Films</h1>
          <p className="font-body text-muted-foreground">
            Manage your filmography and projects
          </p>
        </div>

        <Button className="gap-2" onClick={() => navigate('/admin/films/add')}>
          <Plus className="w-4 h-4" />
          Add Film
        </Button>
      </div>

      {/* Films Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : !films || films.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-xl">
          <p className="font-body text-muted-foreground mb-4">No films yet</p>
          <Button className="gap-2" onClick={() => navigate('/admin/films/add')}>
            <Plus className="w-4 h-4" />
            Add your first film
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {films.map((film) => (
            <div
              key={film._id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors group"
            >
              <div className="relative aspect-[2/3]">
                <img
                  src={film.image.url}
                  alt={film.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {deletingId === film._id ? (
                    <div className="flex items-center gap-1 bg-background/90 backdrop-blur-sm p-1 rounded-lg border border-red-500/50">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 px-2 text-[10px]"
                        onClick={() => deleteMutation.mutate(film._id)}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Confirm'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-[10px]"
                        onClick={() => setDeletingId(null)}
                        disabled={deleteMutation.isPending}
                      >
                        No
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => navigate(`/admin/films/edit/${film._id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="text-red-500"
                        onClick={() => handleDelete(film._id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-body font-semibold text-lg mb-1">{film.title}</h3>
                <p className="font-body text-sm text-muted-foreground mb-2">
                  {film.role} • {film.year}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-1 bg-secondary rounded text-xs">{film.category}</span>
                  {film.rating && (
                    <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                      ⭐ {film.rating}
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded text-xs font-medium ${film.status === 'active'
                    ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                    : 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                    }`}>
                    {film.status === 'active' ? '✓ Published' : '✗ Archived'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilmsManagement;
