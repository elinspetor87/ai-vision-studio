import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { filmService } from '@/services/filmService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const FilmForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    role: '',
    year: new Date().getFullYear(),
    category: '',
    description: '',
    rating: '',
    imdbLink: '',
    showreelUrl: '',
    featured: false,
    status: 'active' as 'active' | 'archived',
    imageUrl: '',
    imageAlt: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Fetch film data if editing
  const { data: filmData } = useQuery({
    queryKey: ['film', id],
    queryFn: () => filmService.getFilmBySlug(id!),
    enabled: isEditMode,
  });

  // Update form when film data is loaded
  useEffect(() => {
    if (filmData) {
      setFormData({
        title: filmData.title,
        role: filmData.role,
        year: filmData.year,
        category: filmData.category,
        description: filmData.description,
        rating: filmData.rating || '',
        imdbLink: filmData.imdbLink || '',
        showreelUrl: filmData.showreelUrl || '',
        featured: filmData.featured,
        status: filmData.status || 'active',
        imageUrl: filmData.image.url,
        imageAlt: filmData.image.alt || '',
      });
      setImagePreview(filmData.image.url);
    }
  }, [filmData]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => filmService.createFilm(data),
    onSuccess: () => {
      toast.success('Film created successfully!');
      queryClient.invalidateQueries({ queryKey: ['films-admin'] });
      navigate('/admin/films');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create film');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => filmService.updateFilm(id!, data),
    onSuccess: () => {
      toast.success('Film updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['films-admin'] });
      navigate('/admin/films');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update film');
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate image
    if (!formData.imageUrl && !imageFile) {
      toast.error('Please provide an image URL or upload an image');
      return;
    }

    // Prepare form data
    const submitData: any = {
      title: formData.title,
      role: formData.role,
      year: String(formData.year),
      category: formData.category,
      description: formData.description,
      featured: formData.featured,
      status: formData.status,
    };

    if (formData.rating) submitData.rating = formData.rating;
    if (formData.imdbLink) submitData.imdbLink = formData.imdbLink;
    if (formData.showreelUrl) submitData.showreelUrl = formData.showreelUrl;

    // Handle image - prioritize URL over file upload
    if (formData.imageUrl) {
      submitData.image = {
        url: formData.imageUrl,
        publicId: formData.imageUrl.split('/').pop() || 'external',
        alt: formData.imageAlt,
      };
    } else if (imageFile) {
      // TODO: Implement Cloudinary upload
      toast.error('File upload requires Cloudinary configuration. Please use an image URL instead.');
      return;
    }

    if (isEditMode) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/films')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="font-display text-3xl font-bold">
            {isEditMode ? 'Edit Film' : 'Add New Film'}
          </h1>
          <p className="font-body text-muted-foreground">
            {isEditMode ? 'Update film information' : 'Add a new film to your portfolio'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-6">
        {/* Image Upload */}
        <div className="space-y-2">
          <Label>Film Poster</Label>

          {/* Image URL Input */}
          <div className="space-y-2">
            <Input
              type="url"
              placeholder="Enter image URL (e.g., https://example.com/poster.jpg)"
              value={formData.imageUrl}
              onChange={(e) => {
                setFormData({ ...formData, imageUrl: e.target.value });
                setImagePreview(e.target.value);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Paste a direct link to your film poster image
            </p>
          </div>

          {/* OR File Upload */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or upload file</span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-48 object-cover rounded-lg border border-border"
              />
            )}
            <div className="flex-1">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Note: File upload requires Cloudinary configuration
              </p>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter film title"
            required
          />
        </div>

        {/* Role & Year */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g., Director, Cinematographer"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year *</Label>
            <Input
              id="year"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              required
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g., Feature Film, Short Film, Documentary"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter film description"
            rows={4}
            required
          />
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <Label htmlFor="rating">Rating (optional)</Label>
          <Input
            id="rating"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
            placeholder="e.g., 8.5, PG-13"
          />
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="imdbLink">IMDb Link (optional)</Label>
            <Input
              id="imdbLink"
              type="url"
              value={formData.imdbLink}
              onChange={(e) => setFormData({ ...formData, imdbLink: e.target.value })}
              placeholder="https://www.imdb.com/title/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="showreelUrl">Showreel URL (optional)</Label>
            <Input
              id="showreelUrl"
              type="url"
              value={formData.showreelUrl}
              onChange={(e) => setFormData({ ...formData, showreelUrl: e.target.value })}
              placeholder="https://vimeo.com/..."
            />
          </div>
        </div>

        {/* Image Alt Text */}
        <div className="space-y-2">
          <Label htmlFor="imageAlt">Image Alt Text (optional)</Label>
          <Input
            id="imageAlt"
            value={formData.imageAlt}
            onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
            placeholder="Describe the image for accessibility"
          />
        </div>

        {/* Featured */}
        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
          <div>
            <Label htmlFor="featured" className="cursor-pointer">Featured Film</Label>
            <p className="text-sm text-muted-foreground">
              Display this film prominently on the homepage
            </p>
          </div>
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Publication Status</Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="active"
                checked={formData.status === 'active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'archived' })}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm">Active (Published)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="archived"
                checked={formData.status === 'archived'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'archived' })}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm">Archived (Hidden)</span>
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            Active films will appear on the website. Archived films will be hidden.
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/films')}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="gap-2">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEditMode ? 'Update Film' : 'Create Film'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FilmForm;
