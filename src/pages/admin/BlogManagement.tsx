import { useQuery } from '@tanstack/react-query';
import { blogService } from '@/services/blogService';
import { Loader2, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const BlogManagement = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['blog-posts-admin'],
    queryFn: () => blogService.getAllPosts(1, 50, undefined, 'all'),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Blog Posts</h1>
          <p className="font-body text-muted-foreground">
            Manage your blog posts and articles
          </p>
        </div>

        <Button className="gap-2" onClick={() => navigate('/admin/blog/add')}>
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </div>

      {/* Posts List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : !data || data.data.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-xl">
          <p className="font-body text-muted-foreground mb-4">No blog posts yet</p>
          <Button className="gap-2" onClick={() => navigate('/admin/blog/add')}>
            <Plus className="w-4 h-4" />
            Create your first post
          </Button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="divide-y divide-border">
            {data.data.map((post) => (
              <div
                key={post._id}
                className="p-6 hover:bg-secondary/50 transition-colors flex items-start gap-4"
              >
                <img
                  src={post.image.url}
                  alt={post.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h3 className="font-body font-semibold text-lg text-foreground mb-1">
                        {post.title}
                      </h3>
                      <p className="font-body text-sm text-muted-foreground line-clamp-2 mb-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className={`px-2 py-1 rounded ${
                          post.status === 'published' ? 'bg-green-500/20 text-green-500' :
                          post.status === 'draft' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-gray-500/20 text-gray-500'
                        }`}>
                          {post.status}
                        </span>
                        <span>{post.category}</span>
                        <span>{post.views} views</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/admin/blog/edit/${post._id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
