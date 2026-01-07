import { useQuery } from '@tanstack/react-query';
import { contactService } from '@/services/contactService';
import { blogService } from '@/services/blogService';
import { filmService } from '@/services/filmService';
import { videoService } from '@/services/videoService';
import { FileText, Film, Video, MessageSquare, Loader2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { data: contactStats, isLoading: statsLoading } = useQuery({
    queryKey: ['contact-stats'],
    queryFn: () => contactService.getStats(),
  });

  const { data: blogPosts, isLoading: blogLoading } = useQuery({
    queryKey: ['blog-posts-count'],
    queryFn: () => blogService.getAllPosts(1, 1),
  });

  const { data: films, isLoading: filmsLoading } = useQuery({
    queryKey: ['films-count'],
    queryFn: () => filmService.getAllFilms(),
  });

  const { data: videos, isLoading: videosLoading } = useQuery({
    queryKey: ['videos-count'],
    queryFn: () => videoService.getAllVideos(),
  });

  const stats = [
    {
      name: 'Blog Posts',
      value: blogPosts?.pagination.total || 0,
      icon: FileText,
      href: '/admin/blog',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      loading: blogLoading,
    },
    {
      name: 'Films',
      value: films?.length || 0,
      icon: Film,
      href: '/admin/films',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      loading: filmsLoading,
    },
    {
      name: 'Videos',
      value: videos?.length || 0,
      icon: Video,
      href: '/admin/videos',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      loading: videosLoading,
    },
    {
      name: 'Messages',
      value: contactStats?.total || 0,
      icon: MessageSquare,
      href: '/admin/messages',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      loading: statsLoading,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Dashboard</h1>
        <p className="font-body text-muted-foreground">
          Overview of your content and activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <TrendingUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>

            {stat.loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : (
              <div className="font-display text-3xl font-bold mb-1">
                {stat.value}
              </div>
            )}

            <p className="font-body text-sm text-muted-foreground">{stat.name}</p>
          </Link>
        ))}
      </div>

      {/* Recent Messages */}
      {contactStats && contactStats.recentSubmissions && contactStats.recentSubmissions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-semibold">Recent Messages</h2>
            <Link
              to="/admin/messages"
              className="font-body text-sm text-primary hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="divide-y divide-border">
              {contactStats.recentSubmissions.slice(0, 5).map((submission) => (
                <Link
                  key={submission._id}
                  to={`/admin/messages`}
                  className="block p-6 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-body font-medium text-foreground truncate">
                          {submission.name}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-body font-medium ${
                            submission.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-500'
                              : submission.status === 'contacted'
                              ? 'bg-blue-500/20 text-blue-500'
                              : submission.status === 'completed'
                              ? 'bg-green-500/20 text-green-500'
                              : 'bg-red-500/20 text-red-500'
                          }`}
                        >
                          {submission.status}
                        </span>
                      </div>
                      <p className="font-body text-sm text-muted-foreground mb-2 line-clamp-2">
                        {submission.message}
                      </p>
                      <p className="font-body text-xs text-muted-foreground">
                        {submission.email} • {new Date(submission.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Message Status Breakdown */}
      {contactStats && contactStats.byStatus && (
        <div>
          <h2 className="font-display text-2xl font-semibold mb-4">
            Message Status Breakdown
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(contactStats.byStatus).map(([status, count]) => (
              <div
                key={status}
                className="bg-card border border-border rounded-xl p-4"
              >
                <p className="font-body text-sm text-muted-foreground capitalize mb-1">
                  {status}
                </p>
                <p className="font-display text-2xl font-bold">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
