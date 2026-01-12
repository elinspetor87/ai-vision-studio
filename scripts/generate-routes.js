import axios from 'axios';

// This script generates all routes that need to be pre-rendered for SEO
export async function generateRoutes() {
  const apiUrl = process.env.VITE_API_URL || 'http://localhost:5000';
  const routes = [
    '/',
    '/blog',
    // Add other static routes here
  ];

  try {
    // Fetch blog posts
    const blogResponse = await axios.get(`${apiUrl}/api/blog`, {
      params: { status: 'published' }
    });

    if (blogResponse.data?.data) {
      const blogPosts = blogResponse.data.data;
      blogPosts.forEach(post => {
        if (post.slug) {
          routes.push(`/blog/${post.slug}`);
        }
      });
    }

    console.log(`✅ Generated ${routes.length} routes for pre-rendering`);
    console.log('Routes:', routes);

    return routes;
  } catch (error) {
    console.warn('⚠️  Could not fetch dynamic routes from API:', error.message);
    console.warn('Using static routes only. Make sure the API server is running during build.');
    return routes;
  }
}

// If running this script directly
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  generateRoutes().then(routes => {
    console.log(JSON.stringify(routes, null, 2));
    process.exit(0);
  }).catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}
