import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialMediaService, SocialMediaLink } from '@/services/socialMediaService';
import { Loader2, Plus, Edit, Trash2, GripVertical, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';

const PLATFORMS = [
  { value: 'Instagram', icon: 'instagram', color: 'bg-pink-500' },
  { value: 'Twitter', icon: 'twitter', color: 'bg-blue-400' },
  { value: 'LinkedIn', icon: 'linkedin', color: 'bg-blue-700' },
  { value: 'YouTube', icon: 'youtube', color: 'bg-red-600' },
  { value: 'TikTok', icon: 'video', color: 'bg-black' },
  { value: 'Facebook', icon: 'facebook', color: 'bg-blue-600' },
  { value: 'Vimeo', icon: 'film', color: 'bg-blue-500' },
  { value: 'Behance', icon: 'layout', color: 'bg-blue-500' },
  { value: 'ArtStation', icon: 'palette', color: 'bg-blue-600' },
  { value: 'IMDB', icon: 'star', color: 'bg-yellow-600' },
  { value: 'Website', icon: 'globe', color: 'bg-gray-600' },
  { value: 'Other', icon: 'link', color: 'bg-gray-500' },
];

const SocialMediaManagement = () => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    platform: 'Instagram',
    username: '',
    url: '',
    enabled: true,
  });

  const { data: links = [], isLoading } = useQuery({
    queryKey: ['social-media-admin'],
    queryFn: () => socialMediaService.getAllLinks(),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => socialMediaService.createLink(data),
    onSuccess: () => {
      toast.success('Link de rede social criado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['social-media-admin'] });
      setIsAdding(false);
      setFormData({ platform: 'Instagram', username: '', url: '', enabled: true });
    },
    onError: (error: any) => {
      console.error('❌ Create Link Error:', error);
      const message = error.response?.data?.message || error.message || 'Falha ao criar link';
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<typeof formData> }) =>
      socialMediaService.updateLink(id, data),
    onSuccess: () => {
      toast.success('Link atualizado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['social-media-admin'] });
      setEditingId(null);
    },
    onError: (error: any) => {
      console.error('❌ Update Link Error:', error);
      const message = error.response?.data?.message || error.message || 'Falha ao atualizar link';
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => socialMediaService.deleteLink(id),
    onSuccess: () => {
      toast.success('Link deletado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['social-media-admin'] });
    },
    onError: (error: any) => {
      console.error('❌ Delete Link Error:', error);
      const message = error.response?.data?.message || error.message || 'Falha ao deletar link';
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (link: SocialMediaLink) => {
    setEditingId(link._id);
    setFormData({
      platform: link.platform,
      username: link.username,
      url: link.url,
      enabled: link.enabled,
    });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ platform: 'Instagram', username: '', url: '', enabled: true });
  };

  const getPlatformInfo = (platform: string) => {
    return PLATFORMS.find(p => p.value === platform) || PLATFORMS[PLATFORMS.length - 1];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Redes Sociais</h1>
          <p className="font-body text-muted-foreground">
            Gerencie seus links de redes sociais
          </p>
        </div>

        {!isAdding && (
          <Button className="gap-2" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4" />
            Adicionar Rede Social
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">
            {editingId ? 'Editar' : 'Adicionar'} Rede Social
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plataforma *</Label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                  required
                >
                  {PLATFORMS.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Nome de usuário / Handle *</Label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="@seunome"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>URL Completa *</Label>
              <Input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="enabled"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="enabled" className="cursor-pointer">
                Visível no site
              </Label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingId ? 'Atualizar' : 'Criar'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Links List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : links.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-xl">
          <p className="font-body text-muted-foreground mb-4">
            Nenhuma rede social configurada ainda
          </p>
          <Button className="gap-2" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4" />
            Adicionar primeira rede social
          </Button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="divide-y divide-border">
            {links.map((link) => {
              const platformInfo = getPlatformInfo(link.platform);
              return (
                <div
                  key={link._id}
                  className="p-6 hover:bg-secondary/50 transition-colors flex items-center gap-4"
                >
                  <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />

                  <div className={`w-10 h-10 ${platformInfo.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                    {link.platform.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-body font-semibold text-foreground">
                        {link.platform}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${link.enabled
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-gray-500/20 text-gray-500'
                        }`}>
                        {link.enabled ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <p className="font-body text-sm text-muted-foreground mb-1">
                      {link.username}
                    </p>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-xs text-primary hover:underline"
                    >
                      {link.url}
                    </a>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(link)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      onClick={() => {
                        if (confirm('Tem certeza que deseja deletar este link?')) {
                          deleteMutation.mutate(link._id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaManagement;
