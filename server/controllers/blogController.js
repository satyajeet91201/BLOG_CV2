import Blog from '../models/Blog.js';
import Comment from '../models/Comments.js';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// Create blog (admin only)
export const createBlog = catchAsync(async (req, res, next) => {
  const { title, subtitle, description, category, imageUrl, youtubeUrl } = req.body;

  if (!title || !description) {
    return next(new AppError("Title and description are required.", 400));
  }

  const thumbnail = req.file?.filename || imageUrl;

  const user = await User.findById(req.userId);
  if (!user) return next(new AppError("User not found", 404));

  if (!["admin", "main-admin"].includes(user.role)) {
    return next(new AppError("Only admins can create blogs", 403));
  }

  const blog = await Blog.create({
    title,
    subtitle,
    description,
    category,
    thumbnail,
    youtubeUrl,
    author: req.userId,
    isPublished: true,
  });

  res.status(201).json({ success: true, message: "Blog created", blog });
});

// Get all blogs
export const getAllBlogs = catchAsync(async (req, res, next) => {
  const blogs = await Blog.find({ isPublished: true })
    .populate("author", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, blogs });
});

// Get single blog
export const getSingleBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id)
    .populate("author", "name email")
    .populate({
      path: 'comments',
      populate: {
        path: 'userId',
        select: 'name',
      },
    });

  if (!blog) {
    return next(new AppError("Blog not found", 404));
  }

  res.status(200).json({ success: true, blog });
});

// Like or Unlike blog
export const likeBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id)
    .populate("author")
    .populate("comments.user");

  if (!blog) return next(new AppError("Blog not found", 404));

  const userId = req.userId;
  const isLiked = blog.likes.includes(userId);

  if (isLiked) {
    blog.likes = blog.likes.filter(id => id.toString() !== userId);
  } else {
    blog.likes.push(userId);
  }

  await blog.save();

  const updatedBlog = await Blog.findById(req.params.id)
    .populate("author")
    .populate("comments.user");

  res.status(200).json({ success: true, blog: updatedBlog });
});

// Add a comment
export const addComment = catchAsync(async (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    return next(new AppError("Comment content cannot be empty", 400));
  }

  const comment = await Comment.create({
    content,
    postId: req.params.id,
    userId: req.userId,
  });

  const blog = await Blog.findById(req.params.id);
  if (!blog) return next(new AppError("Blog not found", 404));

  blog.comments.push(comment._id);
  await blog.save();

  res.status(201).json({ success: true, message: "Comment added", comment });
});

// Get my blogs
export const getMyBlogs = catchAsync(async (req, res, next) => {
  const myBlogs = await Blog.find({ author: req.userId }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: myBlogs.length,
    blogs: myBlogs
  });
});

// Edit blog
export const editBlog = catchAsync(async (req, res, next) => {
  const blogId = req.params.id;
  const { title, subtitle, description, category, isPublished } = req.body;

  const blog = await Blog.findById(blogId);
  if (!blog) return next(new AppError("Blog not found", 404));

  blog.title = title || blog.title;
  blog.subtitle = subtitle || blog.subtitle;
  blog.description = description || blog.description;
  blog.category = category || blog.category;
  blog.isPublished = isPublished !== undefined ? isPublished : blog.isPublished;

  await blog.save();

  res.status(200).json({ success: true, message: "Blog updated", blog });
});

// Delete blog
export const deleteBlog = catchAsync(async (req, res, next) => {
  const blogId = req.params.id;
  const blog = await Blog.findById(blogId);
  if (!blog) return next(new AppError("Blog not found", 404));

  const user = await User.findById(req.userId);
  if (!user) return next(new AppError("User not found", 404));

  // Main admin can delete any blog
  if (user.role === "main-admin") {
    await blog.deleteOne();
    return res.status(200).json({ success: true, message: "Blog deleted by main-admin" });
  }

  // Admins can only delete their own blog
  if (user.role === "admin") {
    if (blog.author.toString() === req.userId) {
      await blog.deleteOne();
      return res.status(200).json({ success: true, message: "Blog deleted by admin" });
    } else {
      return next(new AppError("Admins can only delete their own blogs", 403));
    }
  }

  // All other users
  return next(new AppError("You are not authorized to delete this blog", 403));
});
