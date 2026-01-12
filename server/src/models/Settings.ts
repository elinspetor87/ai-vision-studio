import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  // Quote Section
  quote: {
    mainText: string;
    highlightedText: string;
  };
  bio: string;

  // Showcases/Stats
  showcases: {
    projectsCompleted: string;
    yearsExperience: string;
    happyClients: string;
    aiRenders: string;
  };

  // About/Journey Section
  aboutSection: {
    sectionTitle: string;
    heading: string;
    headingHighlight: string;
    paragraph1: string;
    paragraph2: string;
    stats: {
      filmsShows: string;
      yearsExp: string;
    };
    skills: {
      icon: string;
      label: string;
      years: string;
    }[];
    tools: string[];
  };

  // Profile Image
  profileImage?: {
    url: string;
    publicId: string;
    alt: string;
  };

  // Logo Images
  logo?: {
    url: string;
    publicId: string;
    alt: string;
  };
  logoText?: string;

  // Favicon
  favicon?: {
    url: string;
    publicId: string;
  };

  // Contact Information
  contactEmail?: string;

  // Hero Section
  heroSection?: {
    line1: string;
    line2: string;
    line3: string;
    tagline: string;
    description: string;
    animation: {
      animationType: 'fadeSlide' | 'typewriter' | 'rotateScale' | 'glitch';
      speed: number;
      delay: number;
      typewriterCursor?: boolean;
      glitchIntensity?: number;
    };
  };

  // Advanced Settings
  emailSettings?: {
    host: string;
    port: number;
    user: string;
    pass: string;
    secure: boolean;
    fromEmail: string;
  };

  apiKeys?: {
    key: string;
    label: string;
    lastUsed?: Date;
    createdAt: Date;
  }[];

  updatedAt: Date;
  createdAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    quote: {
      mainText: {
        type: String,
        default: 'AI will not make better artists,',
      },
      highlightedText: {
        type: String,
        default: 'artists will make better work with AI.',
      },
    },
    bio: {
      type: String,
      default: 'Embracing technology as a creative partner, not a replacement. The future of filmmaking is a collaboration between human vision and artificial intelligence.',
    },
    showcases: {
      projectsCompleted: {
        type: String,
        default: '50+',
      },
      yearsExperience: {
        type: String,
        default: '15',
      },
      happyClients: {
        type: String,
        default: '30+',
      },
      aiRenders: {
        type: String,
        default: '100K+',
      },
    },
    aboutSection: {
      sectionTitle: {
        type: String,
        default: 'The Journey',
      },
      heading: {
        type: String,
        default: 'From VFX Pioneer to',
      },
      headingHighlight: {
        type: String,
        default: 'AI Visionary',
      },
      paragraph1: {
        type: String,
        default: "With over 15 years in visual effects, I've had the privilege of working on blockbuster films that have captivated audiences worldwide. From intricate compositing work to leading VFX teams, my journey has been defined by an relentless pursuit of visual excellence.",
      },
      paragraph2: {
        type: String,
        default: "Today, I'm pioneering the integration of AI into filmmaking—leveraging tools like Midjourney, Runway, and Sora to create imagery that was once impossible. My VFX background gives me a unique edge: I understand both the art and the technique.",
      },
      stats: {
        filmsShows: {
          type: String,
          default: '50+',
        },
        yearsExp: {
          type: String,
          default: '15+',
        },
      },
      skills: {
        type: [
          {
            icon: { type: String, default: 'Layers' },
            label: { type: String, default: '' },
            years: { type: String, default: '' },
          },
        ],
        default: [
          { icon: 'Layers', label: 'VFX Compositing', years: '15+ years' },
          { icon: 'Film', label: 'Motion Graphics', years: '12+ years' },
          { icon: 'Wand2', label: 'AI Generation', years: '3+ years' },
          { icon: 'Sparkles', label: 'Video Editing', years: '10+ years' },
        ],
      },
      tools: {
        type: [String],
        default: ['Nuke', 'After Effects', 'Houdini', 'Runway', 'Midjourney', 'Sora', 'ComfyUI', 'DaVinci'],
      },
    },
    profileImage: {
      url: {
        type: String,
        default: '',
      },
      publicId: {
        type: String,
        default: '',
      },
      alt: {
        type: String,
        default: '',
      },
    },
    logo: {
      url: {
        type: String,
        default: '',
      },
      publicId: {
        type: String,
        default: '',
      },
      alt: {
        type: String,
        default: '',
      },
    },
    logoText: {
      type: String,
      default: 'FILMMAKER',
    },
    favicon: {
      url: {
        type: String,
        default: '',
      },
      publicId: {
        type: String,
        default: '',
      },
    },
    contactEmail: {
      type: String,
      default: 'hello@aifilmmaker.com',
    },
    heroSection: {
      line1: {
        type: String,
        default: 'Crafting',
      },
      line2: {
        type: String,
        default: 'Visual Stories',
      },
      line3: {
        type: String,
        default: 'with AI',
      },
      tagline: {
        type: String,
        default: 'AI Filmmaker & VFX Artist',
      },
      description: {
        type: String,
        default: 'Blending decades of VFX expertise with cutting-edge AI technology to create cinematic experiences that push the boundaries of imagination.',
      },
      animation: {
        animationType: {
          type: String,
          enum: ['fadeSlide', 'typewriter', 'rotateScale', 'glitch'],
          default: 'fadeSlide',
        },
        speed: {
          type: Number,
          default: 800,
          min: 300,
          max: 2000,
        },
        delay: {
          type: Number,
          default: 100,
          min: 50,
          max: 500,
        },
        typewriterCursor: {
          type: Boolean,
          default: true,
        },
        glitchIntensity: {
          type: Number,
          default: 5,
          min: 1,
          max: 10,
        },
      },
    },
    // Advanced Settings
    emailSettings: {
      host: { type: String, default: '' },
      port: { type: Number, default: 587 },
      user: { type: String, default: '' },
      pass: { type: String, default: '' }, // Should be encrypted in prod, keeping simple for now
      secure: { type: Boolean, default: false },
      fromEmail: { type: String, default: '' },
    },
    apiKeys: [
      {
        key: { type: String, required: true },
        label: { type: String, default: 'API Key' },
        lastUsed: { type: Date },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model<ISettings>('Settings', settingsSchema);

export default Settings;
