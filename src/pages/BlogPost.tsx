import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CommentForm from '@/components/CommentForm';
import CommentsList from '@/components/CommentsList';
import { Calendar, Clock, ArrowLeft, Tag, Loader2 } from 'lucide-react';
import { blogService } from '@/services/blogService';
import '@/components/admin/RichTextEditor.css';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => blogService.getPostBySlug(slug!),
    enabled: !!slug,
  });

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background pt-24">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background pt-24">
          <div className="container mx-auto px-6 py-20 text-center">
            <h1 className="font-display text-4xl font-bold mb-4">Post Not Found</h1>
            <p className="font-body text-muted-foreground mb-8">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 font-body text-primary hover:gap-3 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.seo?.metaTitle || post.title} | Blog</title>
        <meta
          name="description"
          content={post.seo?.metaDescription || post.excerpt}
        />
        {post.seo?.keywords && (
          <meta name="keywords" content={post.seo.keywords.join(', ')} />
        )}
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-24">
        {/* Back Button */}
        <div className="container mx-auto px-6 py-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>

        {/* Hero Section */}
        <article className="container mx-auto px-6 pb-16">
          {/* Category Badge */}
          <div className="mb-6">
            <span className="px-4 py-2 bg-primary/10 text-primary text-sm font-body font-medium rounded-full">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl">
            {post.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-body mb-8">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {calculateReadTime(post.content)}
            </span>
            {post.author && (
              <span>By {post.author.name}</span>
            )}
          </div>

          {/* Featured Image */}
          <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-12 border border-border">
            <img
              src={post.image.url}
              alt={post.image.alt || post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="max-w-3xl mx-auto">
            {/* Excerpt */}
            <p className="font-body text-xl text-muted-foreground mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Main Content */}
            <div
              className="prose prose-invert prose-lg max-w-none text-justify
                prose-headings:font-display prose-headings:text-foreground
                prose-h2:text-3xl prose-h2:md:text-4xl prose-h2:mt-8 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:md:text-3xl prose-h3:mt-6 prose-h3:mb-4
                prose-h4:text-xl prose-h4:md:text-2xl prose-h4:mt-5 prose-h4:mb-3
                prose-p:font-body prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-8
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold
                prose-code:text-primary prose-code:bg-secondary prose-code:px-2 prose-code:py-1 prose-code:rounded
                prose-pre:bg-secondary prose-pre:border prose-pre:border-border
                prose-img:rounded-xl prose-img:border prose-img:border-border
                prose-blockquote:border-l-primary prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic
                prose-ul:list-disc prose-ol:list-decimal
                prose-li:font-body prose-li:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-border">
                <Tag className="w-4 h-4 text-muted-foreground" />
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-secondary border border-border rounded-full text-sm font-body text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Comments Section */}
            <div className="mt-16 pt-12 border-t border-border space-y-8">
              <CommentsList postId={post._id} />
              <CommentForm postId={post._id} />
            </div>
          </div>
        </article>

        {/* Related Posts / CTA */}
        <section className="py-16 border-t border-border">
          <div className="container mx-auto px-6 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Want to Read More?
            </h2>
            <p className="font-body text-muted-foreground mb-8 max-w-md mx-auto">
              Check out more insights on AI filmmaking and VFX.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-body font-medium rounded-full hover:shadow-[0_0_30px_hsl(38_92%_55%/0.4)] transition-all duration-300"
            >
              View All Posts
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default BlogPost;
