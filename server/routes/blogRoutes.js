import express from "express";
import {
  createBlog,
  getAllBlogs,
  likeBlog,
  editBlog,
  deleteBlog,
  addComment,
  getSingleBlog,
  getMyBlogs,
} from "../controllers/blogController.js";
import { userAuth } from "../middleware/userAuth.js";
import { adminOnly } from "../middleware/adminAuth.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Create Blog (Admin only + with thumbnail)
router.post("/create", userAuth, adminOnly, upload.single('thumbnail'), createBlog);

// Edit Blog (Admin only + with thumbnail)
router.put("/edit/:id", userAuth, adminOnly, upload.single('thumbnail'), editBlog);

// Other routes
router.get("/", userAuth, getAllBlogs);
router.get("/:id", getSingleBlog);
router.get("/my", userAuth, getMyBlogs);
router.delete("/:id", userAuth, adminOnly, deleteBlog);
router.put("/like/:id", userAuth, likeBlog);
router.post("/comment/:id", userAuth, addComment);

export default router;