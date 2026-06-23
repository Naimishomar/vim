import express from 'express';
import { getAllBlogs, getBlogBySlug, getRelatedBlogs } from '../controllers/blog.controller';

const router = express.Router();

router.get('/', getAllBlogs);
router.get('/related/:slug', getRelatedBlogs);
router.get('/:slug', getBlogBySlug);

export default router;
