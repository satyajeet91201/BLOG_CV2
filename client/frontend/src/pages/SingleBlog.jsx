import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const SingleBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl, userData } = useContext(AppContent);

  const [blog, setBlog] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

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
      fetchBlog();
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
      fetchBlog();
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  const startEditing = () => {
    setEditedTitle(blog.title);
    setEditedDescription(blog.description);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedTitle("");
    setEditedDescription("");
  };

  const saveChanges = async () => {
    try {
      const res = await axios.put(
        `${backendUrl}/api/blogs/edit/${id}`,
        {
          title: editedTitle,
          description: editedDescription,
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Blog updated successfully");
        setIsEditing(false);
        fetchBlog();
      }
    } catch (err) {
      toast.error("Failed to update blog");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${backendUrl}/api/blogs/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Blog deleted");
        navigate('/');
      }
    } catch (err) {
      toast.error("Failed to delete blog");
    }
  };

  if (loading) return <div className="mt-32 text-center text-gray-700 dark:text-gray-300">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-28 px-4 text-gray-800 dark:text-white transition-colors duration-300">

        {/* Edit buttons */}
        {userData?.role === "admin" && !isEditing && (
          <div className="mb-4 flex gap-3">
            <button
              onClick={startEditing}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              🗑️ Delete
            </button>
          </div>
        )}

        {/* Blog Title & Description */}
        {isEditing ? (
          <>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-3xl font-bold mb-2 w-full p-2 border dark:bg-gray-800"
            />
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full h-40 p-2 border dark:bg-gray-800 mb-4"
            />
            <div className="flex gap-3 mb-6">
              <button onClick={saveChanges} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">💾 Save</button>
              <button onClick={cancelEditing} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">❌ Cancel</button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              By {blog.author?.name || 'Unknown'} on {new Date(blog.createdAt).toLocaleDateString()}
            </p>
            <p className="mb-6">{blog.description}</p>
          </>
        )}

        {/* Like Button */}
        <div className="mb-4">
          <button
            onClick={handleLike}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
          >
            👍 {blog.likes.length} Like{blog.likes.length !== 1 ? 's' : ''}
          </button>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Comments ({blog.comments.length})</h2>

          {/* Add Comment */}
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

          {/* Comment List */}
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
    </>
  );
};

export default SingleBlog;
