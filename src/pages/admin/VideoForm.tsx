import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { videoService } from '@/services/videoService';
import { uploadService } from '@/services/uploadService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const VideoForm = () => {
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
    videoUrl: '',
    featured: false,
    status: 'active' as 'active' | 'archived',
    thumbnailUrl: '',
    thumbnailAlt: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Fetch video data if editing
  const { data: videoData } = useQuery({
    queryKey: ['video', id],
    queryFn: () => videoService.getVideoBySlug(id!),
    enabled: isEditMode,
  });

  // Update form when video data is loaded
  useEffect(() => {
    if (videoData) {
      setFormData({
        title: videoData.title,
        role: videoData.role,
        year: videoData.year,
        category: videoData.category,
        description: videoData.description,
        videoUrl: videoData.videoUrl,
        featured: videoData.featured,
        status: videoData.status || 'active',
        thumbnailUrl: videoData.thumbnail.url,
        thumbnailAlt: videoData.thumbnail.alt || '',
      });
      setImagePreview(videoData.thumbnail.url);
    }
  }, [videoData]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => videoService.createVideo(data),
    onSuccess: () => {
      toast.success('Video created successfully!');
      queryClient.invalidateQueries({ queryKey: ['videos-admin'] });
      navigate('/admin/videos');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create video');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => videoService.updateVideo(id!, data),
    onSuccess: () => {
      toast.success('Video updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['videos-admin'] });
      navigate('/admin/videos');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update video');
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

    // Validate thumbnail
    if (!formData.thumbnailUrl && !imageFile) {
      toast.error('Please provide a thumbnail URL or upload an image');
      return;
    }

    // Validate video URL
    if (!formData.videoUrl) {
      toast.error('Please provide a video URL');
      return;
    }

    // Prepare form data
    const submitData: any = {
      title: formData.title,
      role: formData.role,
      year: String(formData.year),
      category: formData.category,
      description: formData.description,
      videoUrl: formData.videoUrl,
      featured: formData.featured,
      status: formData.status,
    };

    // Handle thumbnail - prioritize URL over file upload
    if (formData.thumbnailUrl) {
      submitData.thumbnail = {
        url: formData.thumbnailUrl,
        publicId: formData.thumbnailUrl.split('/').pop() || 'external',
        alt: formData.thumbnailAlt,
      };
    } else if (imageFile) {
      try {
        toast.info('Uploading thumbnail...');
        const uploadResult = await uploadService.uploadVideoThumbnail(imageFile);
        submitData.thumbnail = {
          url: uploadResult.url,
          publicId: uploadResult.publicId,
          alt: formData.thumbnailAlt,
        };
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to upload thumbnail');
        return;
      }
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
          onClick={() => navigate('/admin/videos')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="font-display text-3xl font-bold">
            {isEditMode ? 'Edit Video' : 'Add New Video'}
          </h1>
          <p className="font-body text-muted-foreground">
            {isEditMode ? 'Update video information' : 'Add a new video to your portfolio'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-6">
        {/* Thumbnail Upload */}
        <div className="space-y-2">
          <Label>Video Thumbnail</Label>

          {/* Thumbnail URL Input */}
          <div className="space-y-2">
            <Input
              type="url"
              placeholder="Enter thumbnail URL (e.g., https://example.com/thumbnail.jpg)"
              value={formData.thumbnailUrl}
              onChange={(e) => {
                setFormData({ ...formData, thumbnailUrl: e.target.value });
                setImagePreview(e.target.value);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Paste a direct link to your video thumbnail image
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
                className="w-48 h-32 object-cover rounded-lg border border-border"
              />
            )}
            <div className="flex-1">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              {imageFile && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                  ✓ File selected: {imageFile.name}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Upload a thumbnail image from your computer
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
            placeholder="Enter video title"
            required
          />
        </div>

        {/* Video URL */}
        <div className="space-y-2">
          <Label htmlFor="videoUrl">Video URL *</Label>
          <Input
            id="videoUrl"
            type="url"
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            placeholder="https://vimeo.com/... or https://youtube.com/..."
            required
          />
          <p className="text-xs text-muted-foreground">
            Link to the video on Vimeo, YouTube, or another platform
          </p>
        </div>

        {/* Role & Year */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g., Director, Editor, Cinematographer"
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
            placeholder="e.g., Commercial, Music Video, Short Film"
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
            placeholder="Enter video description"
            rows={4}
            required
          />
        </div>

        {/* Thumbnail Alt Text */}
        <div className="space-y-2">
          <Label htmlFor="thumbnailAlt">Thumbnail Alt Text (optional)</Label>
          <Input
            id="thumbnailAlt"
            value={formData.thumbnailAlt}
            onChange={(e) => setFormData({ ...formData, thumbnailAlt: e.target.value })}
            placeholder="Describe the thumbnail for accessibility"
          />
        </div>

        {/* Featured */}
        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
          <div>
            <Label htmlFor="featured" className="cursor-pointer">Featured Video</Label>
            <p className="text-sm text-muted-foreground">
              Display this video prominently on the homepage
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
            Active videos will appear on the website. Archived videos will be hidden.
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/videos')}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="gap-2">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEditMode ? 'Update Video' : 'Create Video'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VideoForm;
