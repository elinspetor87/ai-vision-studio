import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogService } from '@/services/blogService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [] as string[],
    imageUrl: '',
    imageAlt: '',
    featured: false,
    status: 'draft' as 'draft' | 'published' | 'archived',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [tagsInput, setTagsInput] = useState('');

  // Fetch blog post data if editing
  const { data: postData } = useQuery({
    queryKey: ['blog-post', id],
    queryFn: () => blogService.getPostById(id!),
    enabled: isEditMode,
  });

  // Update form when post data is loaded
  useEffect(() => {
    if (postData) {
      setFormData({
        title: postData.title,
        excerpt: postData.excerpt,
        content: postData.content,
        category: postData.category,
        tags: postData.tags || [],
        imageUrl: postData.image.url,
        imageAlt: postData.image.alt || '',
        featured: postData.featured,
        status: postData.status,
      });
      setImagePreview(postData.image.url);
      setTagsInput(postData.tags?.join(', ') || '');
    }
  }, [postData]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => blogService.createPost(data),
    onSuccess: () => {
      toast.success('Blog post created successfully!');
      queryClient.invalidateQueries({ queryKey: ['blog-posts-admin'] });
      navigate('/admin/blog');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to create blog post';
      toast.error(errorMessage);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => blogService.updatePost(id!, data),
    onSuccess: () => {
      toast.success('Blog post updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['blog-posts-admin'] });
      navigate('/admin/blog');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update blog post');
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

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You are not logged in. Please login again.');
      navigate('/admin/login');
      return;
    }

    // Validate image
    if (!formData.imageUrl && !imageFile) {
      toast.error('Please provide an image URL or upload an image');
      return;
    }

    // Validate title
    if (formData.title.length < 5) {
      toast.error('Title must be at least 5 characters long');
      return;
    }

    // Validate content
    if (formData.content.length < 100) {
      toast.error('Content must be at least 100 characters long');
      return;
    }

    // Validate category
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    // Parse tags
    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    // Prepare form data
    const submitData: any = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      category: formData.category,
      tags,
      featured: formData.featured,
      status: formData.status,
    };

    // Handle image - prioritize URL over file upload
    if (formData.imageUrl) {
      submitData.image = {
        url: formData.imageUrl,
        publicId: formData.imageUrl.split('/').pop() || 'external',
        alt: formData.imageAlt,
      };
    } else if (imageFile) {
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
          onClick={() => navigate('/admin/blog')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="font-display text-3xl font-bold">
            {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
          <p className="font-body text-muted-foreground">
            {isEditMode ? 'Update blog post information' : 'Write a new article for your blog'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-6">
        {/* Featured Image */}
        <div className="space-y-2">
          <Label>Featured Image</Label>

          {/* Image URL Input */}
          <div className="space-y-2">
            <Input
              type="url"
              placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
              value={formData.imageUrl}
              onChange={(e) => {
                setFormData({ ...formData, imageUrl: e.target.value });
                setImagePreview(e.target.value);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Paste a direct link to your blog post image
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
            placeholder="Enter blog post title"
            required
          />
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt *</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="Brief summary of your post"
            rows={3}
            required
          />
          <p className="text-xs text-muted-foreground">
            This appears in post previews and search results
          </p>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content">Content *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Write your blog post content here..."
            rows={15}
            required
            className="font-mono"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Supports Markdown formatting</span>
            <span className={formData.content.length < 100 ? 'text-yellow-500' : 'text-green-500'}>
              {formData.content.length} / 100 characters minimum
            </span>
          </div>
        </div>

        {/* Category & Tags */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            >
              <option value="">Select category</option>
              <option value="AI & Film">AI & Film</option>
              <option value="Workflow">Workflow</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Industry">Industry</option>
              <option value="Behind the Scenes">Behind the Scenes</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g., AI, filmmaking, VFX"
            />
            <p className="text-xs text-muted-foreground">
              Separate tags with commas
            </p>
          </div>
        </div>

        {/* Image Alt Text */}
        <div className="space-y-2">
          <Label htmlFor="imageAlt">Image Alt Text</Label>
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
            <Label htmlFor="featured" className="cursor-pointer">Featured Post</Label>
            <p className="text-sm text-muted-foreground">
              Display this post prominently on the homepage
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
                value="draft"
                checked={formData.status === 'draft'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' | 'archived' })}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm">Draft</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="published"
                checked={formData.status === 'published'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' | 'archived' })}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm">Published</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="archived"
                checked={formData.status === 'archived'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' | 'archived' })}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm">Archived</span>
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            Published posts appear on the blog. Drafts are hidden. Archived posts are hidden but preserved.
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/blog')}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="gap-2">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEditMode ? 'Update Post' : 'Create Post'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
