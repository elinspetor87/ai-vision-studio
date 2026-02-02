import { Request, Response } from 'express';
import BlogPost from '../models/BlogPost';
import Project from '../models/Project';
import Film from '../models/Film';

export const generateSitemap = async (req: Request, res: Response) => {
    try {
        const baseUrl = process.env.FRONTEND_URL || 'https://www.felipealmeida.studio';

        // Get all published blog posts
        const blogPosts = await BlogPost.find({ status: 'published' })
            .select('slug updatedAt')
            .sort({ updatedAt: -1 });

        // Get all active projects
        const projects = await Project.find({ status: 'active' })
            .select('slug updatedAt')
            .sort({ updatedAt: -1 });

        // Get all films
        const films = await Film.find()
            .select('slug updatedAt')
            .sort({ updatedAt: -1 });

        // Static pages
        const staticPages = [
            { url: '/', changefreq: 'weekly', priority: 1.0 },
            { url: '/blog', changefreq: 'daily', priority: 0.9 },
            { url: '/contact', changefreq: 'monthly', priority: 0.7 },
        ];

        // Build XML sitemap
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // Add static pages
        staticPages.forEach(page => {
            xml += '  <url>\n';
            xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
            xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
            xml += `    <priority>${page.priority}</priority>\n`;
            xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
            xml += '  </url>\n';
        });

        // Add blog posts
        blogPosts.forEach(post => {
            xml += '  <url>\n';
            xml += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>0.8</priority>\n`;
            xml += `    <lastmod>${post.updatedAt.toISOString()}</lastmod>\n`;
            xml += '  </url>\n';
        });

        // Add projects
        projects.forEach(project => {
            xml += '  <url>\n';
            xml += `    <loc>${baseUrl}/projects/${project.slug}</loc>\n`;
            xml += `    <changefreq>monthly</changefreq>\n`;
            xml += `    <priority>0.7</priority>\n`;
            xml += `    <lastmod>${project.updatedAt.toISOString()}</lastmod>\n`;
            xml += '  </url>\n';
        });

        xml += '</urlset>';

        // Set proper headers
        res.header('Content-Type', 'application/xml');
        res.header('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
        res.send(xml);

    } catch (error) {
        console.error('Error generating sitemap:', error);
        res.status(500).send('Error generating sitemap');
    }
};
