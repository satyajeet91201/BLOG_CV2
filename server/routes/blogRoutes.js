import express from "express";
import { createBlog, getAllBlogs, likeBlog, editBlog, deleteBlog, addComment , getSingleBlog, getMyBlogs} from "../controllers/blogController.js";
import { userAuth } from "../middleware/userAuth.js";
import { adminOnly } from "../middleware/adminAuth.js";

const router = express.Router();

// Only admin can create
router.post("/create", userAuth, adminOnly, createBlog);
router.get("/", userAuth, getAllBlogs);
router.get("/:id", userAuth, getSingleBlog);
router.get("/my", userAuth, getMyBlogs);
router.put("/edit/:id", userAuth, adminOnly, editBlog);
router.delete("/:id", userAuth, adminOnly, deleteBlog);
router.put("/like/:id", userAuth, likeBlog);
router.post("/comment/:id", userAuth, addComment);


export default router;
