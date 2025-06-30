import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { parseMarkdown } from '../context/parseMarkdown';


const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [expandedBlogId, setExpandedBlogId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("https://blog-cv-2.vercel.app/api/blogs", {
          withCredentials: true,
        });
        setBlogs(res.data.blogs);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleCreateBlog = () => {
    navigate('/create-blog');
  };

  const toggleReadMore = (id) => {
    setExpandedBlogId(prev => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-gray-900">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-700 dark:text-gray-200 text-sm">Loading blogs...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="p-4 pt-20 mt-10 max-w-4xl mx-auto text-gray-800 dark:text-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-semibold">All Blogs</h1>
          {userData?.role === "admin" && (
            <button
              onClick={handleCreateBlog}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              + Create Blog
            </button>
          )}
        </div>

        {blogs.length === 0 ? (
          <p>No blogs found.</p>
        ) : (
          blogs.map((blog) => {
            const isExpanded = expandedBlogId === blog._id;
            return (
              <div
                onClick={() => navigate(`/blog/${blog._id}`)}
                key={blog._id}
                className="border p-4 rounded-md mb-4 bg-white dark:bg-gray-800 dark:border-gray-600 shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <h2 className="text-xl font-bold mb-2 text-indigo-700 dark:text-indigo-300">
                  {blog.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  By {blog?.author?.name || "Unknown"} - {new Date(blog.createdAt).toLocaleString()}
                </p>
                <div
                  className={`mb-2 ${!isExpanded ? "line-clamp-3" : ""}`}
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(blog.description) }}
                ></div>
                {blog.description && blog.description.length > 100 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleReadMore(blog._id);
                    }}
                    className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                  </button>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Likes: {blog.likes.length} | Comments: {blog.comments.length}
                </p>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default Blogs;
