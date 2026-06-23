import express from 'express';
import { getAllBlogs, getBlogBySlug } from '../controllers/blog.controller';

const router = express.Router();

router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);

export default router;
