import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/services/settingsService';
import { uploadService } from '@/services/uploadService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, RefreshCcw, Mail, Key, Globe, Plus, Trash2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const SettingsManagement = () => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    quoteMainText: '',
    quoteHighlightedText: '',
    bio: '',
    projectsCompleted: '',
    yearsExperience: '',
    happyClients: '',
    aiRenders: '',
    aboutSectionTitle: '',
    aboutHeading: '',
    aboutHeadingHighlight: '',
    aboutParagraph1: '',
    aboutParagraph2: '',
    aboutStatsFilmsShows: '',
    aboutStatsYearsExp: '',
    aboutSkills: [
      { icon: 'Layers', label: 'VFX Compositing', years: '15+ years' },
      { icon: 'Film', label: 'Motion Graphics', years: '12+ years' },
      { icon: 'Wand2', label: 'AI Generation', years: '3+ years' },
      { icon: 'Sparkles', label: 'Video Editing', years: '10+ years' },
    ],
    aboutTools: ['Nuke', 'After Effects', 'Houdini', 'Runway', 'Midjourney', 'Sora', 'ComfyUI', 'DaVinci'],
    profileImageUrl: '',
    profileImageAlt: '',
    logoUrl: '',
    logoAlt: '',
    logoText: 'FILMMAKER',
    faviconUrl: '',
    contactEmail: 'hello@aifilmmaker.com',
    heroLine1: 'Crafting',
    heroLine2: 'Visual Stories',
    heroLine3: 'with AI',
    heroTagline: 'AI Filmmaker & VFX Artist',
    heroDescription: 'Blending decades of VFX expertise with cutting-edge AI technology to create cinematic experiences that push the boundaries of imagination.',
    heroAnimationType: 'fadeSlide' as 'fadeSlide' | 'typewriter' | 'rotateScale' | 'glitch',
    heroAnimationSpeed: 800,
    heroAnimationDelay: 100,
    heroTypewriterCursor: true,
    heroGlitchIntensity: 5,
    // Email Settings
    emailHost: '',
    emailPort: 587,
    emailUser: '',
    emailPass: '',
    emailSecure: false,
    emailFrom: '',
  });

  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [newKeyLabel, setNewKeyLabel] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string>('');

  // Fetch settings
  const { data: settings, isLoading, refetch } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.getSettings(),
  });

  // Force refresh function
  const handleForceRefresh = async () => {
    toast.info('Refreshing settings...');
    await queryClient.invalidateQueries({ queryKey: ['settings'] });
    await refetch();
    toast.success('Settings refreshed!');
  };

  // Update form when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormData({
        quoteMainText: settings.quote.mainText,
        quoteHighlightedText: settings.quote.highlightedText,
        bio: settings.bio,
        projectsCompleted: settings.showcases.projectsCompleted,
        yearsExperience: settings.showcases.yearsExperience,
        happyClients: settings.showcases.happyClients,
        aiRenders: settings.showcases.aiRenders,
        aboutSectionTitle: settings.aboutSection?.sectionTitle || 'The Journey',
        aboutHeading: settings.aboutSection?.heading || 'From VFX Pioneer to',
        aboutHeadingHighlight: settings.aboutSection?.headingHighlight || 'AI Visionary',
        aboutParagraph1: settings.aboutSection?.paragraph1 || '',
        aboutParagraph2: settings.aboutSection?.paragraph2 || '',
        aboutStatsFilmsShows: settings.aboutSection?.stats.filmsShows || '50+',
        aboutStatsYearsExp: settings.aboutSection?.stats.yearsExp || '15+',
        aboutSkills: settings.aboutSection?.skills || [
          { icon: 'Layers', label: 'VFX Compositing', years: '15+ years' },
          { icon: 'Film', label: 'Motion Graphics', years: '12+ years' },
          { icon: 'Wand2', label: 'AI Generation', years: '3+ years' },
          { icon: 'Sparkles', label: 'Video Editing', years: '10+ years' },
        ],
        aboutTools: settings.aboutSection?.tools || ['Nuke', 'After Effects', 'Houdini', 'Runway', 'Midjourney', 'Sora', 'ComfyUI', 'DaVinci'],
        profileImageUrl: settings.profileImage?.url || '',
        profileImageAlt: settings.profileImage?.alt || '',
        logoUrl: settings.logo?.url || '',
        logoAlt: settings.logo?.alt || '',
        logoText: settings.logoText || 'FILMMAKER',
        faviconUrl: settings.favicon?.url || '',
        contactEmail: settings.contactEmail || 'hello@aifilmmaker.com',
        heroLine1: settings.heroSection?.line1 || 'Crafting',
        heroLine2: settings.heroSection?.line2 || 'Visual Stories',
        heroLine3: settings.heroSection?.line3 || 'with AI',
        heroTagline: settings.heroSection?.tagline || 'AI Filmmaker & VFX Artist',
        heroDescription: settings.heroSection?.description || 'Blending decades of VFX expertise with cutting-edge AI technology to create cinematic experiences that push the boundaries of imagination.',
        heroAnimationType: settings.heroSection?.animation.animationType || 'fadeSlide',
        heroAnimationSpeed: settings.heroSection?.animation.speed || 800,
        heroAnimationDelay: settings.heroSection?.animation.delay || 100,
        heroTypewriterCursor: settings.heroSection?.animation.typewriterCursor ?? true,
        heroGlitchIntensity: settings.heroSection?.animation.glitchIntensity || 5,
        // Email Settings
        emailHost: settings.emailSettings?.host || '',
        emailPort: settings.emailSettings?.port || 587,
        emailUser: settings.emailSettings?.user || '',
        emailPass: settings.emailSettings?.pass || '',
        emailSecure: settings.emailSettings?.secure || false,
        emailFrom: settings.emailSettings?.fromEmail || '',
      });
      setApiKeys(settings.apiKeys || []);

      if (settings.profileImage?.url) {
        setImagePreview(settings.profileImage.url);
      }
      if (settings.logo?.url) {
        setLogoPreview(settings.logo.url);
      }
      if (settings.favicon?.url) {
        setFaviconPreview(settings.favicon.url);
      }
    }
  }, [settings]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => {
      console.log('Saving settings:', data);
      return settingsService.updateSettings(data);
    },
    onSuccess: async (response) => {
      console.log('✅ Save successful, response:', response);
      toast.success('Settings updated successfully!');

      // Clear files after successful save
      setImageFile(null);
      setLogoFile(null);
      setFaviconFile(null);

      // Invalidate cache to refetch latest data
      await queryClient.invalidateQueries({ queryKey: ['settings'] });

      toast.success('Settings saved! Refreshing...');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update settings');
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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFaviconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaviconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data
    const submitData: any = {
      quote: {
        mainText: formData.quoteMainText,
        highlightedText: formData.quoteHighlightedText,
      },
      bio: formData.bio,
      showcases: {
        projectsCompleted: formData.projectsCompleted,
        yearsExperience: formData.yearsExperience,
        happyClients: formData.happyClients,
        aiRenders: formData.aiRenders,
      },
      aboutSection: {
        sectionTitle: formData.aboutSectionTitle,
        heading: formData.aboutHeading,
        headingHighlight: formData.aboutHeadingHighlight,
        paragraph1: formData.aboutParagraph1,
        paragraph2: formData.aboutParagraph2,
        stats: {
          filmsShows: formData.aboutStatsFilmsShows,
          yearsExp: formData.aboutStatsYearsExp,
        },
        skills: formData.aboutSkills,
        tools: formData.aboutTools,
      },
    };

    // Handle profile image - prioritize file upload over URL
    if (imageFile) {
      try {
        toast.info('Uploading profile image...');
        const uploadResult = await uploadService.uploadImage(imageFile);
        submitData.profileImage = {
          url: uploadResult.url,
          publicId: uploadResult.publicId,
          alt: formData.profileImageAlt,
        };
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to upload image');
        return;
      }
    } else if (formData.profileImageUrl) {
      submitData.profileImage = {
        url: formData.profileImageUrl,
        publicId: formData.profileImageUrl.split('/').pop() || 'external',
        alt: formData.profileImageAlt,
      };
    }

    // Handle logo - prioritize file upload over URL
    if (logoFile) {
      try {
        toast.info('Uploading logo...');
        const uploadResult = await uploadService.uploadImage(logoFile);
        submitData.logo = {
          url: uploadResult.url,
          publicId: uploadResult.publicId,
          alt: formData.logoAlt,
        };
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to upload logo');
        return;
      }
    } else if (formData.logoUrl) {
      console.log('📝 Using logo URL from form:', formData.logoUrl);
      submitData.logo = {
        url: formData.logoUrl,
        publicId: formData.logoUrl.split('/').pop() || 'external',
        alt: formData.logoAlt,
      };
    }

    // Logo text
    submitData.logoText = formData.logoText;

    // Handle favicon - prioritize file upload over URL
    if (faviconFile) {
      try {
        toast.info('Uploading favicon...');
        const uploadResult = await uploadService.uploadImage(faviconFile);
        submitData.favicon = {
          url: uploadResult.url,
          publicId: uploadResult.publicId,
        };
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to upload favicon');
        return;
      }
    } else if (formData.faviconUrl) {
      console.log('📝 Using favicon URL from form:', formData.faviconUrl);
      submitData.favicon = {
        url: formData.faviconUrl,
        publicId: formData.faviconUrl.split('/').pop() || 'external',
      };
    }

    // Contact email
    submitData.contactEmail = formData.contactEmail;

    // Hero section
    submitData.heroSection = {
      line1: formData.heroLine1,
      line2: formData.heroLine2,
      line3: formData.heroLine3,
      tagline: formData.heroTagline,
      description: formData.heroDescription,
      animation: {
        animationType: formData.heroAnimationType,
        speed: formData.heroAnimationSpeed,
        delay: formData.heroAnimationDelay,
        typewriterCursor: formData.heroTypewriterCursor,
        glitchIntensity: formData.heroGlitchIntensity,
      },
    };

    // Email Settings
    submitData.emailSettings = {
      host: formData.emailHost,
      port: formData.emailPort,
      user: formData.emailUser,
      pass: formData.emailPass,
      secure: formData.emailSecure,
      fromEmail: formData.emailFrom,
    };

    console.log('💾 Submitting settings:', submitData);
    console.log('📋 FormData favicon before submit:', formData.faviconUrl);
    console.log('📋 FormData logo before submit:', formData.logoUrl);

    updateMutation.mutate(submitData);
  };

  const handleGenerateKey = async () => {
    if (!newKeyLabel) {
      toast.error('Please provide a label for the API Key');
      return;
    }
    try {
      const data = await settingsService.generateApiKey(newKeyLabel);
      setGeneratedKey(data.key);
      setNewKeyLabel('');
      await refetch();
      toast.success('API Key generated!');
    } catch (error: any) {
      toast.error('Failed to generate API Key');
    }
  };

  const handleRevokeKey = async (key: string) => {
    if (!confirm('Are you sure you want to revoke this API Key? Tools using it will stop working.')) return;
    try {
      await settingsService.revokeApiKey(key);
      await refetch();
      toast.success('API Key revoked');
    } catch (error: any) {
      toast.error('Failed to revoke API Key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    toast.success('API Key copied to clipboard!');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold mb-2">Settings</h1>
          <p className="font-body text-muted-foreground">
            Manage your content, email configuration, and API integrations
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleForceRefresh}
            className="gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
            className="gap-2"
          >
            {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            <Save className="w-4 h-4" />
            Save All Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="content" className="gap-2">
            <Globe className="w-4 h-4" />
            Website Content
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="w-4 h-4" />
            Email (SMTP)
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Key className="w-4 h-4" />
            Integrations & API
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          {/* Internal form removed because it's managed by the global handleSubmit */}
          <div className="space-y-6">
            {/* Quote Section */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="font-display text-xl font-semibold">Quote Section</h2>

              <div className="space-y-2">
                <Label htmlFor="quoteMainText">Main Quote Text *</Label>
                <Input
                  id="quoteMainText"
                  value={formData.quoteMainText}
                  onChange={(e) => setFormData({ ...formData, quoteMainText: e.target.value })}
                  placeholder="AI will not make better artists,"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  The main part of your quote
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quoteHighlightedText">Highlighted Quote Text *</Label>
                <Input
                  id="quoteHighlightedText"
                  value={formData.quoteHighlightedText}
                  onChange={(e) => setFormData({ ...formData, quoteHighlightedText: e.target.value })}
                  placeholder="artists will make better work with AI."
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This part will be highlighted in color
                </p>
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="font-display text-xl font-semibold">Bio</h2>

              <div className="space-y-2">
                <Label htmlFor="bio">Your Bio *</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  A short description about you and your work
                </p>
              </div>
            </div>

            {/* Hero Section */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="font-display text-xl font-semibold">Hero Section</h2>
              <p className="text-sm text-muted-foreground">
                Configure the main hero section on your homepage with animated text
              </p>

              {/* Text Inputs */}
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="heroTagline">Tagline</Label>
                  <Input
                    id="heroTagline"
                    value={formData.heroTagline}
                    onChange={(e) => setFormData({ ...formData, heroTagline: e.target.value })}
                    placeholder="AI Filmmaker & VFX Artist"
                  />
                  <p className="text-xs text-muted-foreground">
                    The small text displayed above the title
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="heroLine1">Title Line 1</Label>
                    <Input
                      id="heroLine1"
                      value={formData.heroLine1}
                      onChange={(e) => setFormData({ ...formData, heroLine1: e.target.value })}
                      placeholder="Crafting"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="heroLine2">Title Line 2</Label>
                    <Input
                      id="heroLine2"
                      value={formData.heroLine2}
                      onChange={(e) => setFormData({ ...formData, heroLine2: e.target.value })}
                      placeholder="Visual Stories"
                    />
                    <p className="text-xs text-muted-foreground">
                      This line will have the gradient effect
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="heroLine3">Title Line 3</Label>
                    <Input
                      id="heroLine3"
                      value={formData.heroLine3}
                      onChange={(e) => setFormData({ ...formData, heroLine3: e.target.value })}
                      placeholder="with AI"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heroDescription">Description</Label>
                  <Textarea
                    id="heroDescription"
                    value={formData.heroDescription}
                    onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                    placeholder="Blending decades of VFX expertise..."
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    The paragraph displayed below the title
                  </p>
                </div>
              </div>

              {/* Animation Controls */}
              <div className="border-t border-border pt-4 space-y-4">
                <h3 className="font-body font-semibold text-sm">Animation Settings</h3>

                <div className="space-y-2">
                  <Label htmlFor="heroAnimationType">Animation Style</Label>
                  <Select
                    value={formData.heroAnimationType}
                    onValueChange={(value: 'fadeSlide' | 'typewriter' | 'rotateScale' | 'glitch') =>
                      setFormData({ ...formData, heroAnimationType: value })
                    }
                  >
                    <SelectTrigger id="heroAnimationType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fadeSlide">Fade & Slide Up</SelectItem>
                      <SelectItem value="typewriter">Typewriter Effect</SelectItem>
                      <SelectItem value="rotateScale">Rotate & Scale</SelectItem>
                      <SelectItem value="glitch">Digital Glitch</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Choose the animation style for the hero title
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heroAnimationSpeed">
                    Animation Speed: {formData.heroAnimationSpeed}ms
                  </Label>
                  <Slider
                    id="heroAnimationSpeed"
                    min={300}
                    max={2000}
                    step={50}
                    value={[formData.heroAnimationSpeed]}
                    onValueChange={([value]) =>
                      setFormData({ ...formData, heroAnimationSpeed: value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Duration of each animation (300ms = fast, 2000ms = slow)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heroAnimationDelay">
                    Animation Delay: {formData.heroAnimationDelay}ms
                  </Label>
                  <Slider
                    id="heroAnimationDelay"
                    min={50}
                    max={500}
                    step={10}
                    value={[formData.heroAnimationDelay]}
                    onValueChange={([value]) =>
                      setFormData({ ...formData, heroAnimationDelay: value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Time between each word/character animation
                  </p>
                </div>

                {/* Conditional: Typewriter Cursor */}
                {formData.heroAnimationType === 'typewriter' && (
                  <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                    <Switch
                      id="heroTypewriterCursor"
                      checked={formData.heroTypewriterCursor}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, heroTypewriterCursor: checked })
                      }
                    />
                    <Label htmlFor="heroTypewriterCursor" className="cursor-pointer">
                      Show blinking cursor
                    </Label>
                  </div>
                )}

                {/* Conditional: Glitch Intensity */}
                {formData.heroAnimationType === 'glitch' && (
                  <div className="space-y-2 p-3 bg-secondary/50 rounded-lg">
                    <Label htmlFor="heroGlitchIntensity">
                      Glitch Intensity: {formData.heroGlitchIntensity}
                    </Label>
                    <Slider
                      id="heroGlitchIntensity"
                      min={1}
                      max={10}
                      step={1}
                      value={[formData.heroGlitchIntensity]}
                      onValueChange={([value]) =>
                        setFormData({ ...formData, heroGlitchIntensity: value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Controls how intense the glitch effect appears (1 = subtle, 10 = extreme)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Showcases/Stats Section */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="font-display text-xl font-semibold">Showcases/Statistics</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectsCompleted">Projects Completed</Label>
                  <Input
                    id="projectsCompleted"
                    value={formData.projectsCompleted}
                    onChange={(e) => setFormData({ ...formData, projectsCompleted: e.target.value })}
                    placeholder="50+"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsExperience">Years Experience</Label>
                  <Input
                    id="yearsExperience"
                    value={formData.yearsExperience}
                    onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                    placeholder="15"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="happyClients">Happy Clients</Label>
                  <Input
                    id="happyClients"
                    value={formData.happyClients}
                    onChange={(e) => setFormData({ ...formData, happyClients: e.target.value })}
                    placeholder="30+"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aiRenders">AI Renders</Label>
                  <Input
                    id="aiRenders"
                    value={formData.aiRenders}
                    onChange={(e) => setFormData({ ...formData, aiRenders: e.target.value })}
                    placeholder="100K+"
                  />
                </div>
              </div>
            </div>

            {/* About/Journey Section */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="font-display text-xl font-semibold">About/Journey Section</h2>

              <div className="space-y-2">
                <Label htmlFor="aboutSectionTitle">Section Title</Label>
                <Input
                  id="aboutSectionTitle"
                  value={formData.aboutSectionTitle}
                  onChange={(e) => setFormData({ ...formData, aboutSectionTitle: e.target.value })}
                  placeholder="The Journey"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aboutHeading">Main Heading</Label>
                <Input
                  id="aboutHeading"
                  value={formData.aboutHeading}
                  onChange={(e) => setFormData({ ...formData, aboutHeading: e.target.value })}
                  placeholder="From VFX Pioneer to"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aboutHeadingHighlight">Highlighted Heading</Label>
                <Input
                  id="aboutHeadingHighlight"
                  value={formData.aboutHeadingHighlight}
                  onChange={(e) => setFormData({ ...formData, aboutHeadingHighlight: e.target.value })}
                  placeholder="AI Visionary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aboutParagraph1">First Paragraph</Label>
                <Textarea
                  id="aboutParagraph1"
                  value={formData.aboutParagraph1}
                  onChange={(e) => setFormData({ ...formData, aboutParagraph1: e.target.value })}
                  placeholder="Your first paragraph about your journey..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aboutParagraph2">Second Paragraph</Label>
                <Textarea
                  id="aboutParagraph2"
                  value={formData.aboutParagraph2}
                  onChange={(e) => setFormData({ ...formData, aboutParagraph2: e.target.value })}
                  placeholder="Your second paragraph..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aboutStatsFilmsShows">Films & Shows Stat</Label>
                  <Input
                    id="aboutStatsFilmsShows"
                    value={formData.aboutStatsFilmsShows}
                    onChange={(e) => setFormData({ ...formData, aboutStatsFilmsShows: e.target.value })}
                    placeholder="50+"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aboutStatsYearsExp">Years Experience Stat</Label>
                  <Input
                    id="aboutStatsYearsExp"
                    value={formData.aboutStatsYearsExp}
                    onChange={(e) => setFormData({ ...formData, aboutStatsYearsExp: e.target.value })}
                    placeholder="15+"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Skills (4 items)</Label>
                {formData.aboutSkills.map((skill, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2">
                    <Input
                      value={skill.icon}
                      onChange={(e) => {
                        const newSkills = [...formData.aboutSkills];
                        newSkills[index].icon = e.target.value;
                        setFormData({ ...formData, aboutSkills: newSkills });
                      }}
                      placeholder="Icon (Layers, Film, etc.)"
                    />
                    <Input
                      value={skill.label}
                      onChange={(e) => {
                        const newSkills = [...formData.aboutSkills];
                        newSkills[index].label = e.target.value;
                        setFormData({ ...formData, aboutSkills: newSkills });
                      }}
                      placeholder="Skill label"
                    />
                    <Input
                      value={skill.years}
                      onChange={(e) => {
                        const newSkills = [...formData.aboutSkills];
                        newSkills[index].years = e.target.value;
                        setFormData({ ...formData, aboutSkills: newSkills });
                      }}
                      placeholder="Years"
                    />
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">
                  Available icons: Layers, Film, Wand2, Sparkles
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aboutTools">Tools & Technologies (comma-separated)</Label>
                <Input
                  id="aboutTools"
                  value={formData.aboutTools.join(', ')}
                  onChange={(e) => setFormData({ ...formData, aboutTools: e.target.value.split(',').map(t => t.trim()) })}
                  placeholder="Nuke, After Effects, Houdini, etc."
                />
              </div>
            </div>

            {/* Logo Section */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="font-display text-xl font-semibold">Logo & Branding</h2>

              <div className="space-y-2">
                <Label htmlFor="logoText">Logo Text</Label>
                <Input
                  id="logoText"
                  value={formData.logoText}
                  onChange={(e) => setFormData({ ...formData, logoText: e.target.value })}
                  placeholder="FILMMAKER"
                />
                <p className="text-xs text-muted-foreground">
                  Text that appears next to the logo
                </p>
              </div>

              <div className="space-y-2">
                <Label>Logo Image URL</Label>
                <Input
                  type="url"
                  placeholder="Enter logo image URL"
                  value={formData.logoUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, logoUrl: e.target.value });
                    setLogoPreview(e.target.value);
                  }}
                />
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
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="w-24 h-24 object-contain rounded-lg border border-border bg-secondary/20 p-2"
                  />
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="cursor-pointer"
                  />
                  {logoFile && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                      ✓ File selected: {logoFile.name}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Upload a logo image (PNG with transparency recommended)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoAlt">Logo Alt Text</Label>
                <Input
                  id="logoAlt"
                  value={formData.logoAlt}
                  onChange={(e) => setFormData({ ...formData, logoAlt: e.target.value })}
                  placeholder="Company logo"
                />
              </div>

              {/* Favicon Upload */}
              <div className="border-t border-border pt-4 space-y-4">
                <h3 className="font-body font-semibold text-sm">Favicon</h3>
                <p className="text-xs text-muted-foreground">
                  The small icon that appears in browser tabs. Recommended size: 32x32 or 64x64 pixels.
                </p>

                <div className="space-y-2">
                  <Label>Favicon URL</Label>
                  <Input
                    type="url"
                    placeholder="Enter favicon URL"
                    value={formData.faviconUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, faviconUrl: e.target.value });
                      setFaviconPreview(e.target.value);
                    }}
                  />
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
                  {faviconPreview && (
                    <img
                      src={faviconPreview}
                      alt="Favicon Preview"
                      className="w-16 h-16 object-contain rounded-lg border border-border bg-secondary/20 p-2"
                    />
                  )}
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/x-icon,image/png,image/svg+xml"
                      onChange={handleFaviconChange}
                      className="cursor-pointer"
                    />
                    {faviconFile && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                        ✓ File selected: {faviconFile.name}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Upload a favicon (.ico, .png, or .svg format)
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="hello@aifilmmaker.com"
                />
                <p className="text-xs text-muted-foreground">
                  Email displayed in the footer
                </p>
              </div>
            </div>

            {/* Profile Image Section */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="font-display text-xl font-semibold">Profile Image</h2>

              <div className="space-y-2">
                <Label>Profile Image URL</Label>
                <Input
                  type="url"
                  placeholder="Enter image URL"
                  value={formData.profileImageUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, profileImageUrl: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                />
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
                    className="w-32 h-40 object-cover rounded-lg border border-border"
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
                    Upload an image from your computer (will be uploaded to Cloudinary)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileImageAlt">Image Alt Text</Label>
                <Input
                  id="profileImageAlt"
                  value={formData.profileImageAlt}
                  onChange={(e) => setFormData({ ...formData, profileImageAlt: e.target.value })}
                  placeholder="Describe the image for accessibility"
                />
              </div>
            </div>

          </div>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
              <CardDescription>
                Configure how the website sends emails (Newsletter, Contact Form).
                If left empty, system environment variables will be used as fallback.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emailHost">SMTP Host</Label>
                  <Input
                    id="emailHost"
                    value={formData.emailHost}
                    onChange={(e) => setFormData({ ...formData, emailHost: e.target.value })}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailPort">SMTP Port</Label>
                  <Input
                    id="emailPort"
                    type="number"
                    value={formData.emailPort}
                    onChange={(e) => setFormData({ ...formData, emailPort: parseInt(e.target.value) })}
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emailUser">SMTP User (Email)</Label>
                  <Input
                    id="emailUser"
                    value={formData.emailUser}
                    onChange={(e) => setFormData({ ...formData, emailUser: e.target.value })}
                    placeholder="your-email@gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailPass">SMTP Password / App Password</Label>
                  <Input
                    id="emailPass"
                    type="password"
                    value={formData.emailPass}
                    onChange={(e) => setFormData({ ...formData, emailPass: e.target.value })}
                    placeholder="••••••••••••••••"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailFrom">From Email (Display Name Support)</Label>
                <Input
                  id="emailFrom"
                  value={formData.emailFrom}
                  onChange={(e) => setFormData({ ...formData, emailFrom: e.target.value })}
                  placeholder='"AI Vision Studio" <hello@aifilmmaker.com>'
                />
              </div>

              <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-secondary/20">
                <Switch
                  id="emailSecure"
                  checked={formData.emailSecure}
                  onCheckedChange={(checked) => setFormData({ ...formData, emailSecure: checked })}
                />
                <div className="space-y-0.5">
                  <Label htmlFor="emailSecure">Secure Connection (SSL)</Label>
                  <p className="text-xs text-muted-foreground">Enable for port 465, disable for 587 (STARTTLS)</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-secondary/10 flex justify-between border-t mt-6">
              <p className="text-xs text-muted-foreground italic">
                Note: Changes take effect immediately after saving.
              </p>
              <Button type="button" variant="outline" size="sm" onClick={handleSubmit}>
                <Save className="w-4 h-4 mr-2" />
                Save Email Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Keys (Incoming Integrations)</CardTitle>
              <CardDescription>
                Generate keys to allow external tools like <strong>n8n</strong> or <strong>Make</strong> to feed content to your website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Generate Key Section */}
              <div className="flex flex-col md:flex-row gap-3 items-end p-4 border border-primary/20 bg-primary/5 rounded-lg">
                <div className="flex-1 space-y-2 w-full">
                  <Label htmlFor="newKeyLabel">Key Label</Label>
                  <Input
                    id="newKeyLabel"
                    value={newKeyLabel}
                    onChange={(e) => setNewKeyLabel(e.target.value)}
                    placeholder="e.g. n8n Content Sync"
                  />
                </div>
                <Button type="button" onClick={handleGenerateKey} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Generate Key
                </Button>
              </div>

              {/* Show Generated Key (One time) */}
              {generatedKey && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg space-y-3 animate-in fade-in zoom-in duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 text-sm">New API Key Generated!</h4>
                      <p className="text-xs text-muted-foreground">Copy it now. It will not be shown again for security.</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setGeneratedKey(null)}>✕</Button>
                  </div>
                  <div className="flex gap-2">
                    <code className="flex-1 p-2 bg-background rounded border border-border font-mono text-xs overflow-x-auto">
                      {generatedKey}
                    </code>
                    <Button size="sm" onClick={() => copyToClipboard(generatedKey)}>
                      {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              )}

              {/* Keys List */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Active API Keys</h4>
                {apiKeys.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic py-4 text-center border border-dashed rounded-lg">
                    No active API keys found.
                  </p>
                ) : (
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary/50">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium">Label</th>
                          <th className="px-4 py-2 text-left font-medium">Key Prefix</th>
                          <th className="px-4 py-2 text-left font-medium">Last Used</th>
                          <th className="px-4 py-2 text-right font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {apiKeys.map((key: any) => (
                          <tr key={key.key}>
                            <td className="px-4 py-3 font-medium">{key.label}</td>
                            <td className="px-4 py-3 font-mono text-xs">
                              {key.key.substring(0, 8)}...
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-white hover:bg-destructive"
                                onClick={() => handleRevokeKey(key.key)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Usage Hint */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex gap-3">
                  <div className="mt-0.5">💡</div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">How to use with n8n:</p>
                    <p className="text-xs text-muted-foreground">
                      In your n8n HTTP Request node, add a header: <br />
                      <code className="text-blue-600 dark:text-blue-300">x-api-key: your-generated-key</code>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManagement;
