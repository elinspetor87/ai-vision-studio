import express from 'express';
import { generateSitemap } from '../controllers/sitemapController';

const router = express.Router();

// GET /api/sitemap.xml - Generate dynamic sitemap
router.get('/sitemap.xml', generateSitemap);

export default router;
