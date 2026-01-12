import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Calendar, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { blogService } from '@/services/blogService';
import { newsletterService } from '@/services/newsletterService';
import { toast } from 'sonner';

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  const { data, isLoading, error } = useQuery({
    queryKey: ['blog-posts', currentPage],
    queryFn: () => blogService.getAllPosts(currentPage, postsPerPage),
  });

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };
  return (
    <>
      <Helmet>
        <title>Blog | AI Filmmaker & VFX Artist</title>
        <meta
          name="description"
          content="Insights, tutorials, and thoughts on AI filmmaking, visual effects, and the future of creative technology."
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-24">
        {/* Hero Section */}
        <section className="py-16 border-b border-border">
          <div className="container mx-auto px-6">
            <p className="font-body text-sm tracking-[0.2em] uppercase text-primary mb-4">
              Blog & Insights
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Thoughts on <span className="text-gradient">AI & Film</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl">
              Exploring the intersection of artificial intelligence, visual effects,
              and the art of storytelling. Insights from 15+ years in the industry.
            </p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            {isLoading && (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}

            {error && (
              <div className="text-center py-20">
                <p className="text-red-500 font-body">
                  Failed to load blog posts. Please try again later.
                </p>
              </div>
            )}

            {data && data.data && (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {data.data.map((post, index) => (
                    <Link
                      to={`/blog/${post.slug}`}
                      key={post._id}
                      className="group bg-card-gradient rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_40px_hsl(38_92%_55%/0.1)]"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.image.url}
                          alt={post.image.alt || post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        <span className="absolute bottom-4 left-4 px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-body font-medium rounded-full">
                          {post.category}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground font-body mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {calculateReadTime(post.content)}
                          </span>
                        </div>

                        <h2 className="font-display text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {post.title}
                        </h2>

                        <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        <span className="inline-flex items-center gap-2 font-body text-sm text-primary group-hover:gap-3 transition-all duration-300">
                          Read More
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {data.pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-secondary border border-border rounded-lg font-body text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary transition-colors"
                    >
                      Previous
                    </button>

                    <div className="flex gap-2">
                      {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg font-body text-sm transition-colors ${currentPage === page
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary border border-border hover:border-primary'
                            }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(data.pagination.pages, prev + 1))}
                      disabled={currentPage === data.pagination.pages}
                      className="px-4 py-2 bg-secondary border border-border rounded-lg font-body text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 border-t border-border">
          <div className="container mx-auto px-6 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Stay Updated
            </h2>
            <p className="font-body text-muted-foreground mb-8 max-w-md mx-auto">
              Get the latest insights on AI filmmaking and VFX delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const emailInput = form.elements.namedItem('email') as HTMLInputElement;
                  const email = emailInput.value;
                  const button = form.querySelector('button');

                  if (!email) {
                    toast.error('Please enter your email address');
                    return;
                  }

                  try {
                    if (button) {
                      button.disabled = true;
                      button.innerHTML = '<span class="animate-spin mr-2">⟳</span> Subscribing...';
                    }

                    await newsletterService.subscribe({ email, source: 'blog' });
                    toast.success('Successfully subscribed to the newsletter!');
                    form.reset();
                  } catch (error: any) {
                    toast.error(error.message || 'Failed to subscribe');
                  } finally {
                    if (button) {
                      button.disabled = false;
                      button.textContent = 'Subscribe';
                    }
                  }
                }}
                className="flex flex-col sm:flex-row gap-4 w-full"
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-6 py-3 bg-secondary border border-border rounded-full font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-primary text-primary-foreground font-body font-medium rounded-full hover:shadow-[0_0_30px_hsl(38_92%_55%/0.4)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed min-w-[140px]"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Blog;
