import express from 'express';
import { generateSitemap } from '../controllers/sitemapController';

const router = express.Router();

// GET /sitemap.xml
router.get('/sitemap.xml', generateSitemap);

// GET /robots.txt
router.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://www.felipealmeida.studio/sitemap.xml`);
});

export default router;
