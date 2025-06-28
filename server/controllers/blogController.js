// controllers/blogController.js
import Blog from '../models/Blog.js';
import Comment from '../models/Comments.js';
import User from '../models/userModel.js';

// Create blog (admin only)
export const createBlog = async (req, res) => {
  const { title, subtitle, description, category } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Only allow if email is admin's email (you can change this)
    if (user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admin can create blogs" });
    }

    const blog = await Blog.create({
      title,
      subtitle,
      description,
      category,
      author: req.userId,
      isPublished: true,
    });

    res.status(201).json({ success: true, message: "Blog created", blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).populate("author", "name email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single blog
export const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name email")
      .populate("comments.user", "name"); // ✅ this is the key line

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Like or Unlike blog
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    const userId = req.userId;
    const isLiked = blog.likes.includes(userId);

    if (isLiked) {
      blog.likes = blog.likes.filter(id => id.toString() !== userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();
    res.status(200).json({ success: true, likes: blog.likes.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Add a comment
export const addComment = async (req, res) => {
  const { content } = req.body;
  try {
    const comment = await Comment.create({
      content,
      postId: req.params.id,
      userId: req.userId,
    });

    const blog = await Blog.findById(req.params.id);
    blog.comments.push(comment._id);
    await blog.save();

    res.status(201).json({ success: true, message: "Comment added", comment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/blogs/my
export const getMyBlogs = async (req, res) => {
  try {
    const myBlogs = await Blog.find({ author: req.userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: myBlogs.length,
      blogs: myBlogs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/blogs/edit/:id
export const editBlog = async (req, res) => {
  const blogId = req.params.id;
  const { title, subtitle, description, category, isPublished } = req.body;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    blog.title = title || blog.title;
    blog.subtitle = subtitle || blog.subtitle;
    blog.description = description || blog.description;
    blog.category = category || blog.category;
    blog.isPublished = isPublished !== undefined ? isPublished : blog.isPublished;

    await blog.save();

    res.status(200).json({ success: true, message: "Blog updated", blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/blogs/:id
export const deleteBlog = async (req, res) => {
  const blogId = req.params.id;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    await blog.deleteOne();

    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
