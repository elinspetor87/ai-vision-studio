export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: {
    url: string;
    publicId: string;
    alt?: string;
  };
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  author: {
    name: string;
    email: string;
  };
  views: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface Film {
  _id: string;
  title: string;
  slug: string;
  role: string;
  year: number;
  category: string;
  image: {
    url: string;
    publicId: string;
    alt?: string;
  };
  rating?: string;
  description: string;
  imdbLink?: string;
  showreelUrl?: string;
  order: number;
  featured: boolean;
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoProject {
  _id: string;
  title: string;
  slug: string;
  category: string;
  year: number;
  description: string;
  role: string;
  thumbnail: {
    url: string;
    publicId: string;
    alt?: string;
  };
  videoUrl: string;
  order: number;
  featured: boolean;
  status?: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  role: string;
  year: number;
  category: string;
  description: string;
  thumbnail: {
    url: string;
    publicId: string;
    alt?: string;
  };
  gallery: {
    url: string;
    publicId: string;
    alt?: string;
  }[];
  videoUrl?: string;
  links: {
    label: string;
    url: string;
  }[];
  order: number;
  featured: boolean;
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  message: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  notes?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
