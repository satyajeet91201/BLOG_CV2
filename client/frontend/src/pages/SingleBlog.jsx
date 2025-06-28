import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const SingleBlog = () => {
  const { id } = useParams();
  const { backendUrl, userData } = useContext(AppContent);
  const [blog, setBlog] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/blogs/${id}`, {
        withCredentials: true,
      });
      setBlog(res.data.blog);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load blog");
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    try {
      await axios.put(`${backendUrl}/api/blogs/like/${id}`, {}, { withCredentials: true });
      fetchBlog(); // Refresh blog data
    } catch (err) {
      toast.error("Failed to like blog");
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post(
        `${backendUrl}/api/blogs/comment/${id}`,
        { content: newComment },
        { withCredentials: true }
      );
      toast.success("Successfully added the comment");
      setNewComment("");
      fetchBlog(); // Refreshes comments
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  if (loading) return <div className="mt-32 text-center text-gray-700 dark:text-gray-300">Loading...</div>;

  return (<>
    <Navbar/>
    <div className="max-w-3xl mx-auto mt-28 px-4 text-gray-800 dark:text-white transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        By {blog.author?.name || 'Unknown'} on {new Date(blog.createdAt).toLocaleDateString()}
      </p>
      <p className="mb-6">{blog.description}</p>

      <div className="mb-4">
        <button
          onClick={handleLike}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
        >
          👍 {blog.likes.length} Like{blog.likes.length !== 1 ? 's' : ''}
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Comments ({blog.comments.length})</h2>

        <div className="mb-4">
          <textarea
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 dark:text-white mb-2"
            placeholder="Add your comment..."
            rows="3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button
            onClick={handleComment}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Submit Comment
          </button>
        </div>

        {blog.comments.map((c, i) => (
          <div
            key={i}
            className="border-t border-gray-200 dark:border-gray-600 py-2 text-sm"
          >
            <p className="font-medium">{c.user?.name || 'User'}:</p>
            <p>{c.comment}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(c.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  </>);
};

export default SingleBlog;
