
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '@/services/projectService';
import { uploadService } from '@/services/uploadService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Loader2, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

const ProjectForm = () => {
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
        gallery: [] as { url: string; publicId: string; alt?: string }[],
        links: [] as { label: string; url: string }[],
    });

    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

    // Gallery state
    const [newGalleryUrl, setNewGalleryUrl] = useState('');
    const [galleryFile, setGalleryFile] = useState<File | null>(null);

    // Links state
    const [newLinkLabel, setNewLinkLabel] = useState('');
    const [newLinkUrl, setNewLinkUrl] = useState('');

    // Fetch project data if editing
    const { data: projectData } = useQuery({
        queryKey: ['project', id],
        queryFn: () => projectService.getAllProjects().then(projects => projects.find(p => p._id === id)),
        // The service doesn't have getById, but getProjectBySlug takes slug. 
        // Usually admin uses ID. Let's rely on getAll for now or if getProjectBySlug handles ID too.
        // Wait, getAllProjects returns array. I can just filter from current cache or refetch all.
        // Ideally I should fix service to have getById but let's just use what we have.
        enabled: isEditMode,
    });

    // Update form when data loaded
    useEffect(() => {
        if (projectData) {
            setFormData({
                title: projectData.title,
                role: projectData.role,
                year: projectData.year,
                category: projectData.category,
                description: projectData.description,
                videoUrl: projectData.videoUrl || '',
                featured: projectData.featured,
                status: projectData.status,
                thumbnailUrl: projectData.thumbnail.url,
                thumbnailAlt: projectData.thumbnail.alt || '',
                gallery: projectData.gallery || [],
                links: projectData.links || [],
            });
            setThumbnailPreview(projectData.thumbnail.url);
        }
    }, [projectData]);

    const createMutation = useMutation({
        mutationFn: (data: any) => projectService.createProject(data),
        onSuccess: () => {
            toast.success('Project created successfully!');
            queryClient.invalidateQueries({ queryKey: ['projects-admin'] });
            navigate('/admin/projects');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create project');
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: any) => projectService.updateProject(id!, data),
        onSuccess: () => {
            toast.success('Project updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['projects-admin'] });
            navigate('/admin/projects');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update project');
        },
    });

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnailFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setThumbnailPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleAddGalleryImage = async () => {
        if (!newGalleryUrl && !galleryFile) return;

        let newImage = { url: '', publicId: '', alt: '' };

        if (newGalleryUrl) {
            newImage = {
                url: newGalleryUrl,
                publicId: newGalleryUrl.split('/').pop() || 'external',
                alt: '',
            };
        } else if (galleryFile) {
            try {
                toast.info('Uploading gallery image...');
                const result = await uploadService.uploadImage(galleryFile);
                newImage = {
                    url: result.url,
                    publicId: result.publicId,
                    alt: '',
                };
            } catch (error) {
                toast.error('Failed to upload image');
                return;
            }
        }

        setFormData(prev => ({
            ...prev,
            gallery: [...prev.gallery, newImage]
        }));
        setNewGalleryUrl('');
        setGalleryFile(null);
        toast.success('Image added to gallery');
    };

    const handleRemoveGalleryImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }));
    };

    const handleAddLink = () => {
        if (!newLinkLabel || !newLinkUrl) return;
        setFormData(prev => ({
            ...prev,
            links: [...prev.links, { label: newLinkLabel, url: newLinkUrl }]
        }));
        setNewLinkLabel('');
        setNewLinkUrl('');
    };

    const handleRemoveLink = (index: number) => {
        setFormData(prev => ({
            ...prev,
            links: prev.links.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let submitData: any = {
            title: formData.title,
            role: formData.role,
            year: formData.year,
            category: formData.category,
            description: formData.description,
            videoUrl: formData.videoUrl,
            featured: formData.featured,
            status: formData.status,
            gallery: formData.gallery,
            links: formData.links,
        };

        // Handle thumbnail
        if (formData.thumbnailUrl) {
            submitData.thumbnail = {
                url: formData.thumbnailUrl,
                publicId: formData.thumbnailUrl.split('/').pop() || 'external',
                alt: formData.thumbnailAlt,
            };
        } else if (thumbnailFile) {
            try {
                toast.info('Uploading thumbnail...');
                const result = await uploadService.uploadImage(thumbnailFile);
                submitData.thumbnail = {
                    url: result.url,
                    publicId: result.publicId,
                    alt: formData.thumbnailAlt,
                };
            } catch (error) {
                toast.error('Failed to upload thumbnail');
                return;
            }
        } else if (!isEditMode) {
            toast.error('Thumbnail is required');
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
        <div className="max-w-4xl space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/admin/projects')}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="font-display text-3xl font-bold">
                        {isEditMode ? 'Edit Project' : 'Add New Project'}
                    </h1>
                    <p className="font-body text-muted-foreground">
                        {isEditMode ? 'Update project details' : 'Add a new project to your portfolio'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Main Info Card */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                    <div className="space-y-2">
                        <Label>Thumbnail Image *</Label>
                        <div className="flex items-start gap-4">
                            {thumbnailPreview && (
                                <img src={thumbnailPreview} className="w-32 h-20 object-cover rounded border border-border" alt="Preview" />
                            )}
                            <div className="flex-1 space-y-2">
                                <Input
                                    type="url"
                                    placeholder="Image URL"
                                    value={formData.thumbnailUrl}
                                    onChange={e => {
                                        setFormData({ ...formData, thumbnailUrl: e.target.value });
                                        setThumbnailPreview(e.target.value);
                                    }}
                                />
                                <div className="relative flex items-center">
                                    <span className="w-full border-t border-border" />
                                    <span className="absolute left-1/2 -translate-x-1/2 bg-card px-2 text-xs text-muted-foreground">OR UPLOAD</span>
                                </div>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Input
                                id="category"
                                required
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                placeholder="e.g. Interactive, 3D Art"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role *</Label>
                            <Input
                                id="role"
                                required
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="year">Year *</Label>
                            <Input
                                id="year"
                                type="number"
                                required
                                value={formData.year}
                                onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            required
                            rows={4}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="videoUrl">Video URL (e.g. YouTube)</Label>
                        <Input
                            id="videoUrl"
                            value={formData.videoUrl}
                            onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                        />
                    </div>
                </div>

                {/* Gallery Section */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h2 className="text-xl font-semibold">Gallery</h2>

                    <div className="flex gap-4 items-end bg-secondary/20 p-4 rounded-lg">
                        <div className="flex-1 space-y-2">
                            <Label>Add Image URL</Label>
                            <Input
                                value={newGalleryUrl}
                                onChange={e => setNewGalleryUrl(e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <Label>Or Upload</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={e => setGalleryFile(e.target.files?.[0] || null)}
                            />
                        </div>
                        <Button type="button" onClick={handleAddGalleryImage}>Add</Button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {formData.gallery.map((img, i) => (
                            <div key={i} className="relative group aspect-video bg-black rounded-lg overflow-hidden">
                                <img src={img.url} alt="Gallery item" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveGalleryImage(i)}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {formData.gallery.length === 0 && (
                            <p className="col-span-full text-center text-muted-foreground py-8">No gallery images added</p>
                        )}
                    </div>
                </div>

                {/* Links Section */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h2 className="text-xl font-semibold">External Links</h2>

                    <div className="flex gap-4 items-end bg-secondary/20 p-4 rounded-lg">
                        <div className="flex-1 space-y-2">
                            <Label>Label</Label>
                            <Input
                                value={newLinkLabel}
                                onChange={e => setNewLinkLabel(e.target.value)}
                                placeholder="e.g. Live Site"
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <Label>URL</Label>
                            <Input
                                value={newLinkUrl}
                                onChange={e => setNewLinkUrl(e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                        <Button type="button" onClick={handleAddLink}>Add</Button>
                    </div>

                    <div className="space-y-2">
                        {formData.links.map((link, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-secondary/10 border rounded-lg">
                                <div className="flex gap-2">
                                    <span className="font-medium">{link.label}:</span>
                                    <a href={link.url} target="_blank" className="text-primary hover:underline truncate max-w-xs">{link.url}</a>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveLink(i)}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        {formData.links.length === 0 && (
                            <p className="text-center text-muted-foreground py-4">No links added</p>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between p-6 bg-card border border-border rounded-xl sticky bottom-4">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="status">Status:</Label>
                        <select
                            className="bg-background border border-border rounded px-2 py-1"
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                        >
                            <option value="active">Active</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>

                    <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={() => navigate('/admin/projects')}>Cancel</Button>
                        <Button type="submit" disabled={isLoading} className="gap-2">
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Save Project
                        </Button>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default ProjectForm;
