"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blog_controller_1 = require("../controllers/blog.controller");
const router = express_1.default.Router();
router.get('/', blog_controller_1.getAllBlogs);
router.get('/related/:slug', blog_controller_1.getRelatedBlogs);
router.get('/:slug', blog_controller_1.getBlogBySlug);
exports.default = router;
//# sourceMappingURL=blog.routes.js.map